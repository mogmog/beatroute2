#!/bin/bash
tmux new-session -s beatroute -n 'beatrouteWindow' -d

tmux send-keys -t beatroute:beatrouteWindow.0 'npm start' C-j

# split the window *vertically*
tmux split-window -v

#proxy
tmux send-keys -t 1 'node proxy.js' C-j

tmux split-window -h

# python api
tmux select-window -t beatroute:beatrouteWindow.2
tmux send-keys -t beatroute:beatrouteWindow.2 'cd api' C-j

tmux send-keys -t beatroute:beatrouteWindow.2 'source brenv/bin/activate' C-j
tmux send-keys -t beatroute:beatrouteWindow.2 'export APP_SETTINGS="development"' C-j
tmux send-keys -t beatroute:beatrouteWindow.2 'export DATABASE_URL="postgresql://postgres:postgres@localhost/beatroute2"' C-j
tmux send-keys -t beatroute:beatrouteWindow.2 'python run.py' C-j

# finally attach to the session
tmux attach -t beatroute
