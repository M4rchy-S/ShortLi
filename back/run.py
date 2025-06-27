import subprocess
import threading

def stream_output(process, name):
    for line in iter(process.stdout.readline, b''):
        print(f"[{name}] {line.decode().rstrip()}")

services = [
    ("geturl", ["node", "geturl/app.js"]),
    ("shorten", ["node", "shorten/app.js"]),
    ("analytic_service", ["node", "analyt_service/app.js"])
]

if __name__ == "__main__":
    processes = []

    for name, cmd in services:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1
        )
        processes.append(proc)
        threading.Thread(target=stream_output, args=(proc, name), daemon=True).start()


    try:
        for proc in processes:
            proc.wait()
    except KeyboardInterrupt:
        print("\nStopping services...")
        for proc in processes:
            proc.terminate()
        
