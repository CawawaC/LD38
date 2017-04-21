function Player()
{ 
}

Player.prototype.path; 

Player.prototype.create= function()
{ 
	var rect = new Rectangle([0, 0], [25, 25]);
	rect.center = this.mousePoint;
	path = new Path.Rectangle(rect, 6);
	path.fillColor = "red";
	
}
Player.prototype.update = function(mousePoint)
{	
	path.position.x +=(mousePoint.x-path.position.x)/5;
	path.position.y +=(mousePoint.y-path.position.y)/5;
}


