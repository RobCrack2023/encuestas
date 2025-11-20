import multiprocessing

# Dirección y puerto
bind = "127.0.0.1:5000"

# Número de workers (recomendado: 2-4 x número de CPUs)
workers = multiprocessing.cpu_count() * 2 + 1

# Tipo de worker
worker_class = "sync"

# Timeout
timeout = 120

# Logs
accesslog = "/var/log/encuestas/access.log"
errorlog = "/var/log/encuestas/error.log"
loglevel = "info"

# Reiniciar workers después de X requests (previene memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Daemon
daemon = False
