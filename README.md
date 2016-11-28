COP4331
Group #21


########################################################################

Running the app
1) 	Have mongo installed on your system
	-add MongoDB bin to your path
	 typicaly here C:\Program Files\MongoDB\Server\3.2\bin is added to the path

2)	also install node.js 
	-add the nodejs file to your path
	 typicaly here: C:\Program Files\nodejs

3) open a cmd and type the command "mongod"

4) open another command prompt and cd to loginapp

5) type "node app" in the cmd

6) open a browser and type http://localhost:3000

########################################################################

UPDATED

you will now need a account level 3 to access the permissions section of the site
and an account level of 3 or 2 to access the checkin section of the site. 

by default the acccount type will be of level 1 so you must manually change your own account


1) get the server and app running by following the instructions above

2) create an account with the name of 'test' in the register section

3) open a mongoshell by opening a cmd and typing mongo

4) type: use loginapp

5) paste "db.users.update({name:'test'}, { $set: { accountlevel: '3'} })"

6) type "db.users.find()" your account with the name test should have accountlevel: 3 now

7) alternativly you can change the default value of the account level to 3 and make an account
   and then change it back.
   			-longinapp/models/users.js
   				look for the UserSchema and find the 'accountlevel' feild and change "default: '1' " -> "default: '3' "