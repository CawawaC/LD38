function Forme()
{ 
}

Forme.prototype.path; 

Forme.prototype.create= function()
{ 

	this.path = new Path();
	this.path=this.creationTraceTete("rond");
	this.path = this.path.unite(this.creationTraceCorps("rond"));
	this.path = this.path.unite(this.creationTracePieds("triangle"));
	this.path.fillColor = "red";
	
}


Forme.prototype.creationTraceTete = function(figure)
{
	var path = new Path();
    var rayon = 50;
    var points ;
    switch(figure)
    {
            case"rond":            
			path=this.creationPath(45,12,0,0);
			path = path.unite(this.creationPath(25,12,0,-40));
			path = path.subtract(this.creationPath(25,3,0,-6,270));
			path = path.unite(this.creationPath(10,3,0,-3,270));
            break;	
            case"carre":
            path=this.creationPath(48,4,0,0);
			path = path.unite(this.creationPath(25,3,0,-40,270));
			 path = path.subtract(this.creationPath(20,12,0,0));
			path = path.unite(this.creationPath(10,12,0,0));
            break;
        case "triangle":
          path=this.creationPath(55,3,0,0,270);
		  path = path.subtract(this.creationPath(20,4,0,6));
			path = path.unite(this.creationPath(10,4,0,6));
            break;
    } 
	path.position.y=-80;	
	return path;
}

Forme.prototype.creationTraceCorps = function(figure)
{
	var path = new Path();
	var path02 = new Path();
    var rayon = 50;
    var points ;
    switch(figure)	
    {
        case"rond":            
			path=this.creationPath(50,12,0,0);
			path = path.unite(this.creationPath(15,4,-70,0));
			path = path.unite(this.creationPath(15,4,70,0));	
			path = path.subtract(this.creationPath(17,12,0,0));
            break;
        case"carre":
            path=this.creationPath(55,4,0,0);	
			path = path.unite(this.creationPath(15,3,-50,20,15));
			path = path.unite(this.creationPath(15,3,50,20,45));
			path = path.subtract(this.creationPath(7,4,0,0));
            break;
        case "triangle":
          path=this.creationPath(60,3,0,0,270);
		  path = path.unite(this.creationPath(20,12,0,-27));
		  path = path.subtract(this.creationPath(12,3,0,8,270));
            break;
    }    
	return path;
}

Forme.prototype.creationTracePieds = function(figure)
{
	var path = new Path();
    var rayon = 50;
    var points ;
    switch(figure)
    {
            case"rond":            
			path=this.creationPath(35,12);
			path = path.unite(this.creationPath(15,12,0,55));
            break;
            case"carre":
            path=this.creationPath(50,4,0,0);
			path = path.subtract(this.creationPath(15,4,0,0));
			path = path.unite(this.creationPath(25,4,0,45));
			
            break;
        case "triangle":
			path=this.creationPath(50,3,0,0,270);
			path =  path.unite(this.creationPath(20,3,0,45,270));
			path = path.unite(this.creationPath(10,3,0,70,270));
            break;
    }   
	path.position.y=80;		
	return path;
}

Forme.prototype.creationPath = function(rayon,sommets,x=0,y=0,angle=0)
{
	var path = new Path();
	path.closed = true;
	for (var i = 0; i < sommets; i++) {
		var delta = new Point({
			length: rayon,
			angle: (360 / sommets) * i
		});
		path.add(delta);
	}
	path.rotate(angle);
    path.position.x=x;
	path.position.y=y;
	return path;
}

