This Version: -> 
Instead of /validate/localhost we now only use /validate to be able to support app on Domain

Next:-
remove logins.json (

we have to delete this file and create a new one with the same name, but with the following content:
maps database logins to the users of the system, so that we can authenticate them when they try to log in. The file should be a JSON file with the following structure:
not good, we should use a more secure way to store the logins, such as a database or an encrypted file. 
)

Terraform files
Jenkins CI/CD Pipeline
K8

