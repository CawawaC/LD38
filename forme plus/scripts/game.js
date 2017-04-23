

paper.install(window);
window.onload = function()
{
	// setup paper JS
	paper.setup('gameCanvas');
	var tool = new Tool();

	// variables et objets
	var mousePoint = view.center;
	var player = new Forme();
	player.create();
	player.path.position.x=100;
	player.path.position.y=300;
	
	// paper JS event mouse
	tool.onMouseMove = function(event)
	{
		mousePoint = event.point;
	}
		
	//paper JS event enter frame
	view.onFrame = function (event)
	{
		//player.update(mousePoint);
	}
	
}
