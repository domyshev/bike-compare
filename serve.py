#!/usr/bin/env python3
"""Static file server for dist/ with revalidation-friendly caching.

Unlike `python -m http.server`, this always sends Cache-Control: no-cache
so a normal browser reload revalidates every asset instead of serving a
stale heuristic-cache copy (the "hard reload needed" problem).
"""
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 10010
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()
    def log_message(self, fmt, *args):
        pass  # keep background logs quiet

if __name__ == '__main__':
    os.chdir(ROOT)
    http.server.ThreadingHTTPServer(('0.0.0.0', PORT), NoCacheHandler).serve_forever()