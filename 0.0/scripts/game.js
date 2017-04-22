

paper.install(window);
window.onload = function ()
{
	// setup paper JS
	paper.setup('gameCanvas');
	var tool = new Tool();

	// variables et objets
	var mousePoint = view.center;
    var timerCompteARebours = setInterval(changeCompteARebours, 100);
    var compte =0;
    function changeCompteARebours() { 
        compte++;
       textCompteARebours.content = (4-Math.floor(compte/10))+" : "+(9-compte%10); 
        if(compte>=40)
        {
            clearInterval(timerCompteARebours);
            timerCompteARebours = setInterval(changeCompteARebours, 100);
            compte =0;
        }
    }
    
    var textCompteARebours = new paper.PointText(new paper.Point(100,100));
    textCompteARebours.fillColor = 'purple';
    textCompteARebours.content = '0';

    
    var formeSauvage = Forme();
    formeSauvage = new Forme();
	formeSauvage.create();
    formeSauvage.touchable=false;
    formeSauvage.trace01.position.x =300;
    formeSauvage.trace01.position.y =300;
    
    var groupeDomestique =[];
    
    for (var i = 0; i<10; i++)
    {
        var formeDomestique = Forme();
        formeDomestique = new Forme();
        formeDomestique.create();
        formeDomestique.touchable=true;
        formeDomestique.glisse = false;
        formeDomestique.domestication();
        groupeDomestique.push(formeDomestique);
    }
    
	// paper JS event mouse
	tool.onMouseMove = function(event)
	{
		mousePoint = event.point;
	}
    
    tool.onMouseDown = function(event)
	{
		//formeDomestique.mouseDown(event.point);
        
         for (var i = 0; i<10; i++)
        {
            groupeDomestique[i].mouseDown(event.point);
            if( groupeDomestique[i].glisse)
            {
                 groupeDomestique[i].trace01.bringToFront();
                break;
            }
        }
	}
    
     tool.onMouseUp = function(event)
	{
		//formeDomestique.mouseUp(event.point);
         
        var hitResult = formeDomestique.trace01.intersects(formeSauvage.trace01);

        if (hitResult)
        {
           console.log('collide');
        }
         
         for (var i = 0; i<10; i++)
        {
            groupeDomestique[i].mouseUp(event.point);
        }
	}
		
	//paper JS event enter frame
	view.onFrame = function (event)
	{
		//formeDomestique.update(mousePoint);
        
         for (var i = 0; i<10; i++)
        {
            groupeDomestique[i].update(mousePoint);
            for(var j = 0 ; j < groupeDomestique.length ; j++) {
                if(groupeDomestique[i].trace01.intersects(groupeDomestique[j].trace01)) {
                    groupeDomestique[i].rebondit();
                    groupeDomestique[j].rebondit();
                }
            }
        }
	}
    
    audioInit();
}
