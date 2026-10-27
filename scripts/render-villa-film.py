"""Render the homepage film from approved photographs, without a runtime dependency.
Requires ffmpeg with libx264. Run with the website virtualenv; outputs are committed.
"""
import json
import hashlib
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
FPS, SECONDS, OVERLAP = 30, 5, .8
SOURCES = [
    '/assets/editorial/villa-light-1536.webp',
    '/assets/enhanced/listing-1685140810-1086.webp',
    '/assets/enhanced/listing-2569998613-1536.webp',
    '/assets/enhanced/listing-2580025730-1536.webp',
    '/assets/enhanced/guide-transfer-1536.webp',
]
KITCHEN = '/assets/enhanced/listing-1852228438-1536.webp'

def run(args):
    subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-filter_complex_threads', '2', *args], check=True)

def framing(w, h):
    # Hold every photograph at fixed coordinates. Slow zoompan crops round to whole
    # pixels, which made railings and roof edges visibly wobble in the first film.
    return (f'scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,'
            f'crop={w}:{h},setsar=1,format=yuv420p')

def render(label, w, h, crf, work):
    clips=[]
    for i, source in enumerate(SOURCES):
        out=work/f'{label}-{i}.mp4'
        args=['-loop','1','-framerate',str(FPS),'-i', str(ROOT/source.lstrip('/'))]
        if i == 2:
            args += ['-loop','1','-framerate',str(FPS),'-i', str(ROOT/KITCHEN.lstrip('/'))]
            if label == 'desktop':
                left = int(w*.64)//2*2
                filt=(f'[0:v]{framing(left-4,h)}[a];[1:v]{framing(w-left-4,h)}[b];'
                      f'[a]pad={left+4}:{h}:0:0:color=0x0E1B2C[pad];[pad][b]hstack=inputs=2[v]')
            else:
                top = int(h*.63)//2*2
                filt=(f'[0:v]{framing(w,top-4)}[a];[1:v]{framing(w,h-top-4)}[b];'
                      f'[a]pad={w}:{top+4}:0:0:color=0x0E1B2C[pad];[pad][b]vstack=inputs=2[v]')
            args += ['-filter_complex', filt, '-map', '[v]']
        else:
            args += ['-vf', framing(w,h)]
        run(args+['-frames:v',str(FPS*SECONDS),'-an','-c:v','libx264','-preset','fast','-crf','0','-threads','2',str(out)])
        clips.append(out)
    args=[]
    for p in clips:args += ['-i',str(p)]
    graph=[]
    for i in range(5):graph.append(f'[{i}:v]settb=AVTB,setpts=PTS-STARTPTS[v{i}]')
    transitions=['fade']*4
    prev='v0'
    for i,transition in enumerate(transitions,1):
        output=f'x{i}'
        graph.append(f'[{prev}][v{i}]xfade=transition={transition}:duration={OVERLAP}:offset={i*(SECONDS-OVERLAP):.2f}[{output}]')
        prev=output
    dest=work/f'white-swan-{label}.mp4'
    run(args+['-filter_complex',';'.join(graph),'-map',f'[{prev}]','-an','-c:v','libx264','-preset','slow','-crf',str(crf),'-maxrate','8000k' if label=='desktop' else '5000k','-bufsize','16000k' if label=='desktop' else '10000k','-pix_fmt','yuv420p','-movflags','+faststart','-threads','2',str(dest)])
    digest=hashlib.sha256(dest.read_bytes()).hexdigest()[:12]
    final=ROOT/'assets/film'/f'white-swan-{label}-{digest}.mp4'
    shutil.copyfile(dest,final)
    dest=final
    print(f'{label}: {dest.stat().st_size/1024/1024:.2f} MiB',flush=True)
    return {'url':'/'+str(dest.relative_to(ROOT)), 'width':w, 'height':h, 'bytes':dest.stat().st_size}

if __name__=='__main__':
    with tempfile.TemporaryDirectory(prefix='white-swan-film-') as tmp:
        variants={name:render(name,w,h,crf,Path(tmp)) for name,w,h,crf in [('desktop',1920,1080,17),('mobile',960,1200,18)]}
    manifest={'title':'White Swan, from day to night','duration_seconds':21.8,'fps':FPS,'audio':False,
              'technique':'Fixed property photographs with cross-dissolves. No camera zoom, pan, sliding transition or simulated live-action footage.',
              'sources':SOURCES+[KITCHEN],'variants':variants,
              'chapters':[{'start':round(i*4.2+.4 if i else 0,2),'key':key} for i,key in enumerate(['villa','pool','table','bedroom','night'])]}
    (ROOT/'content/villa-film.json').write_text(json.dumps(manifest,indent=2)+'\n')
