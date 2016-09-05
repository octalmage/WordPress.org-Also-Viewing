var socket;
var users;
$(document).on('ready', function()
{
	socket = io("https://viewing-server.herokuapp.com");
	var uregex = /Howdy, (.*)\n/;
	var match = uregex.exec($(".login").text());
	if (!match)
	{
		return;
	}
	var username = match[1];
	var page = window.location.pathname;
	socket.on('connect', function()
	{
		socket.emit('pageopened',
		{
			username: username,
			page: page
		});

		socket.on(page, function(data)
		{
			if (data.length > 1)
			{
				var userlist = [];
				var ending = "";
				var flag = 0;
				for (x in data)
				{
					if (data[x].username != username && typeof data[x].username != "undefined")
					{
						//Other users exist!
						flag = 1;
						userlist.push(data[x].username);
					}
				}

				//Fixes duplicate usernames.
				userlist = userlist.getUnique();

				$("#viewing-top").text("");

				if (userlist.length == 1)
				{
					ending = "is also viewing this page.";
				}
				else
				{
					ending = "are also viewing this page.";
				}
				if (flag == 1)
				{
					if (!$("#viewing-top")[0])
					{
						$("#pagebody").css('margin-top', '50px');
						$("#headline").append('<div id="viewing-top" style="font-size: 14px; color: #fff; line-height: 30px; font-family: Helvetica,sans-serif; background: #45bbe6; border-bottom: 1px solid #dfdfdf; width:100%; height:30px; text-align: center; color: #ffffff">Jason Stallings is also viewing.</div>');
					}
					$("#viewing-top").text(userlist.join(", ") + " " + ending);
				}
			}
			else
			{
				$("#pagebody").css('margin-top', '29px');
				$("#viewing-top").remove();
			}
			users = data;
		});
	});
});

//From: http://stackoverflow.com/a/1961068/2233771	
Array.prototype.getUnique = function()
{
	var u = {},
		a = [];
	for (var i = 0, l = this.length; i < l; ++i)
	{
		if (u.hasOwnProperty(this[i]))
		{
			continue;
		}
		a.push(this[i]);
		u[this[i]] = 1;
	}
	return a;
}