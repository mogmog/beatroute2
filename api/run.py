import os

from app import create_app

config_name = os.getenv('APP_SETTINGS')
app = create_app(config_name)
print (123)
print (config_name)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
