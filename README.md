# chat_app_master_thesis
Repository for chat app for master thesis


#groups

/groups

returns all chat groups

/groups/addGroup?name=group123&code=groupcodexyz

add group

/groups/removeGroup?name=group123

remove group

#users

/users?group=group123

get all users from this group

/users/addUser?username=user1234&displayName=Radiozead

add user

/users/addUserToGroup?username=user1234&group=group123

add user to group

/users/removeUserFromGroup?username=user1234&group=group123

remove user from group

#messages

/message/writeMessage?fromUserName=user1234&toUserName=user456&messageText=HelloWorld

Send message from one user to another

/message/getConversation?fromUserName=user1234&toUserName=user456&queryLimit=10&skip=0

Get conversation between two users

tbc

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
