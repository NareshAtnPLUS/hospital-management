import sys

print(sys.version)
from hospital_management import webapp
# from hospital_management import db,manager

if __name__ == '__main__':
	webapp.run(debug=True)
	# manager.run()