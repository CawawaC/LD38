var centerX = 200;
var centerY = 600;
var petiteEchelle = 0.2, grandeEchelle = 2;

function Forme()
{ 
    //Prototype
    this.trace01;
    this.trace01Segments =[];
    this.vitesseX ;
    this.vitesseY;
    this.touchable;
    this.glisse;
    this.colors = ['red', 'blue', 'purple'];
    this.figures = ['rond', 'carre', 'triangle'];
    this.paramForme = [];
}

Forme.prototype.create= function()
{ 
	var rect = new Rectangle([0, 0], [25, 25]);
	rect.center = this.mousePoint;
	this.trace01 = new Group();
    
    var figure;
    var _point;
    var _figureName;
    var _figureColor;
    _figureColor =this.colors[Math.floor(Math.random()*4)];
    for( var i = 0; i <3; i++)
    {

        _figureName =this.figures[Math.floor(Math.random()*this.figures.length)];
        
        figure = this.creationTrace(_figureName);
        figure.fillColor = _figureColor;
       figure.position.y = i*80;
        this.trace01Segments[i]=[];
      /* for(var j = 0; j<figure.segments.length; j++)
                 {
                     point = new Point(figure.segments[j].point);
                this.trace01Segments[i][j]=_point ;
                 }*/
       this.paramForme[i]= [];
        this.paramForme[i].push(_figureName);
         this.paramForme[i].push(_figureColor);
        this.trace01.addChild(figure);
    }
    this.trace01.fillColor =_figureColor;
    //spawn
    this.trace01.position.x=centerX;
    this.trace01.position.y=centerY;
    
    this.vitesseAleatoire();
    
    this.touchable = true;
    this.glisse = true;
}

Forme.prototype.domestication= function()
{ 	
	this.trace01.scale(petiteEchelle);

	
}

Forme.prototype.creationTrace = function(figure)
{
	var path = new Path();
    var rayon = 50;
    var points ;
    switch(figure)
    {
           case"rond":
            points =12;
            break;
            case"carre":
            points =4;
            break;
        case "triangle":
            points=3;
            break;
    }
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
   
    for(var i = 0; i<this.trace01.children.length; i++)
        {
           // this.trace01.children[i].fillColor="#141241";
            console.log(this.trace01.children[i].fillColor);
        }
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
     
 
    } else if(!this.glisse && this.touchable) {
        var newX = this.trace01.position.x + this.vitesseX;
        var newY = this.trace01.position.y + this.vitesseY;
        var distToCenter = Math.sqrt(Math.pow(newX-centerX, 2) + Math.pow(newY-centerY, 2));

        if(distToCenter < 120) {
            this.trace01.position.x = newX;
            this.trace01.position.y = newY;
        } else {
            this.trace01.vitesseX * -1;
            this.trace01.vitesseY * -1;
        }
    }
}

Forme.prototype.vitesseAleatoire = function() {
    this.vitesseX = (Math.random()*2-1)*0.6;
    this.vitesseY = (Math.random()*2-1)*0.6;
}

Forme.prototype.rebondit = function() {
    var tempX = this.vitesseX;
    this.vitesseX = this.vitesseY;
    this.vitesseY = tempX;
}

Forme.prototype.mouseUp = function(mousePoint)
{	
    if(this.glisse)
   { this.trace01.scale(1/(grandeEchelle));

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
        this.trace01.scale(grandeEchelle);

    }	
}


