

paper.install(window);
window.onload = function()
{
	// setup paper JS
	paper.setup('gameCanvas');
	var tool = new Tool();

	// variables et objets
	var mousePoint = view.center;
	var player = new Player();
	player.create();

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
    
    createjs.Tween.get( player.path.position, { loop: true } )
  .to( { x: 300 }, 1000, createjs.Ease.quadOut )
  .wait( 2000 )
  .to( { x: 100, y: 300 }, 1000, createjs.Ease.quadOut )
  .wait( 2000 )
  .to( { x: 100, y: 100 }, 1000, createjs.Ease.quadOut )
  .wait( 2000 )
  .call( function() {
    console.log( 'done!' );
  } );
    
    createjs.Ticker.setFPS( 60 );
   createjs.Ticker.addEventListener( 'tick', update );
}
