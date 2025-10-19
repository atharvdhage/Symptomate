#!/usr/bin/env python3
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs

PORT = 5000

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == "__main__":
    Handler = NoCacheHTTPRequestHandler
    
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Symptomate server running at http://0.0.0.0:{PORT}")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
