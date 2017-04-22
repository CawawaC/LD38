function Forme()
{ 
    //Prototype
    this.trace01;
    this.trace01Segments =[];
    this.vitesseX;
    this.vitesseY;
    this.touchable;
    this.glisse;
    this.colors = ['red', 'green', 'blue', 'purple'];
    this.figures = ['rond', 'carre', 'triangle'];
}

Forme.prototype.create= function()
{ 
	var rect = new Rectangle([0, 0], [25, 25]);
	rect.center = this.mousePoint;
	this.trace01 = new Group();
    
    var figure;
    var _point;
    for( var i = 0; i <4; i++)
    {
        figure = this.creationTrace(this.figure[Math.floor(Math.random()*this.figure.length)]);
        figure.fillColor = colors[Math.floor(Math.random()*4)];
       figure.position.x = i*20;
        // this.trace01Segments[i] = figure.segments;
        this.trace01Segments[i]=[];
      /* for(var j = 0; j<figure.segments.length; j++)
                 {
                     point = new Point(figure.segments[j].point);
                this.trace01Segments[i][j]=_point ;
                 }*/
       
        this.trace01.addChild(figure);
    }
    
        
    this.trace01.position.x=200;
        this.trace01.position.y=200;
    
    this.touchable = true;
    this.glisse = true;
}

Forme.prototype.domestication= function()
{ 
	
	this.trace01.scale(.5);
	
}

Forme.prototype.creationTrace = function(figure)
{
	var path = new Path();
    var rayon = 50;
    var points = 12;
	path.closed = true;
	for (var i = 0; i < points; i++) {
		var delta = new Point({
			length: rayon,
			angle: (360 / points) * i
		});
		path.add(delta);
	}
	return path;
}


Forme.prototype.update = function(mousePoint)
{	
	if(this.glisse && this.touchable)
    {
        this.trace01.position.x =(mousePoint.x);
        this.trace01.position.y =(mousePoint.y);
        
     /*  for (var i = 0; i<4; i++)
            {
             for(var j = 0; j<this.trace01.children[i].segments.length; j++)
                 {
                this.trace01.children[i].segments[j].point = this.trace01Segments[i][j];
                     this.trace01.children[i].segments[j].point.x+= Math.random()*2-1;
                      this.trace01.children[i].segments[j].point.y+= Math.random()*2-1;
                    
                 }
            }*/
     
 
    }
}

Forme.prototype.mouseUp = function(mousePoint)
{	
    if(this.glisse)
   { this.trace01.scale(.5);
    this.glisse=false;
   }
}


Forme.prototype.mouseDown = function(mousePoint)
{	
    var hitResult = this.trace01.hitTest(mousePoint, {
	segments: true,
	stroke: true,
	fill: true,
	tolerance: 5
    });
	
	if (hitResult)
    {
        this.glisse = true;
        this.trace01.scale(2);
    }	
}


