$(document).ready(function(){

	// chose an object to hold all values
	const shapeEditor = {
		selected: {
			id: ""
		},
		knobs:{
			rotate:{

			},
			radius:{

			}
		},
		dpad:{
			up: "",
			right: "",
			down: "",
			left: ""
		},
		scaleBtn:{
			downX: "",
			upX: "",
			downY: "",
			upY: ""

		},
		shapes: []
	};

	
	// add object to shape array
	$("#addShape").on("click",function(){
		// add new shape to shapes array
		addShape(shapeEditor);
		// update shapes in display window
		renderShapes(shapeEditor["shapes"]);
		// update shapes info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
	});

	// removes an object from shape array
	$("#removeShape").on("click", function(){
		// remove shape from shapes array
		removeShape(shapeEditor["shapes"], shapeEditor["selected"])
		// update shapes in display window
		renderShapes(shapeEditor["shapes"]);
		// update shapes info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
	});

	// event listener for info window checkbox selection
	$("#infoWindow").on("mousedown", "input", function(){
		// get id from selected checkbox
		const $clicked = $(this).attr("id");
		// set checkbox value of selected shape
		setSelectedCheckbox(shapeEditor["shapes"], $clicked);
		// update shape info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
	});


	const addShape = function(object){

		// create unique id for shape identification within program
		const shapeID = uniqueID();

		object["shapes"].push({
			id: shapeID,
	        name: getShapeName(),
	        checkbox: true,
	        scaleX: "33",
	        scaleY: "33",
	        transX: "33",
	        transY: "33",
	        rotate: "0",
	        radius: "0"
		});

		// set newly created shape id to selected.id
		object["selected"]["id"] = shapeID;
		setSelectedCheckbox(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
	};

	const removeShape = function(shapes, selected){

		// get shape index
		const index = shapes.findIndex(function(shape){
			return shape.id === selected.id
		});
		// use index to splice object from shapes array
		if(index > -1){
			shapes.splice(index, 1);
		};
	};

	// Assign name to newly created shape
	const getShapeName = function(){

		const $shapeName = $("#shapeName").val();
		// check for user specified name, if false use generic
    	return $shapeName != "" ? $shapeName : "New Shape";
	};

	// Allow only one checkbox to show true at a time
	const setSelectedCheckbox = function(shapes, selected){
		// search for shape id that matches selected shape id, set checkbox to true; all else to false
		shapes.forEach(function(shape){
			shape["id"] === selected ? shape["checkbox"] = true : shape["checkbox"] = false;
		});
	};

	// returns selected shape
	const getSelectedShape = function(shapes, selected){
		// find shape id that matches selected shape id, return object to caller
		return shapes.find(function(shape){
			return shape.id === selected;
		});
	};

	// Render shapes in display window
	const renderShapes = function(shapes){

		const $displayWindow = $("#displayWindow")
		// clear displayWindow children
		$displayWindow.empty();
		// create div with object values for each object in shapes array, append to display window
		shapes.forEach(function(shape){

			$("<div/>")
			.css("background-color", "blue")
			.css("width", `${shape["scaleX"]}%`)
			.css("height", `${shape["scaleY"]}%`)
			.css("transform", `${shape["rotate"]}`)
			.css("border-radius", `${shape["radius"]}`)
			.css("left", `${shape["transX"]}%`)
			.css("top", `${shape["transY"]}%`)
			.css("position", "absolute")

			.appendTo($displayWindow);
		});
	};

	// Render shape info in info window
	const renderShapeInfo = function(shapes, selected){

		const $infoWindow = $("#infoWindow");
		// clear infoWindow children
		$infoWindow.empty();
		// create div with children elements, checkbox, index, title, append to infoWindow
		shapes.forEach(function(shape, index){

	        const $infoEl = $("<div/>");

	        const $checkbox = $("<input/>").attr("type", "checkbox")
	        					.prop("checked", shape["checkbox"])
	        					.attr("id", shape["id"]);
	        $checkbox.appendTo($infoEl);

	        const $indexEl = $("<span/>").text(`${index + 1 }.`);
	        $indexEl.appendTo($infoEl);

	        const $nameEl = $("<span/>").text(` ${shape["name"]}`);
	        $nameEl.appendTo($infoEl);

	       	$infoEl.appendTo($infoWindow);
	    });
	};

	// Produces random number between caller specific values
	const randomNum = function(min, max){

	    return Math.floor(Math.random() * (max - min) + min);
	};

	// Returns unique 16 character string, used for shape ID
	const uniqueID = function(){

	    const numArray = [];
	    const charGroups = [];

	    for(a = 0; a < 16; a++){
	        const newNum = randomNum(1, 4);

	        if(newNum === 1){
	            // A - Z
	            numArray.push(randomNum(65, 90));
	        } else if(newNum === 2){
	            // 0 - 9
	            numArray.push(randomNum(48, 57));
	        } else if(newNum === 3){
	            // a - z
	            numArray.push(randomNum(97, 122));
	        }
	    };

	    const charArray = numArray.map(function(num){
	        return String.fromCharCode(num);
	    });

	    for(i = 0; i < 4; i++){
	        charGroups.push([charArray.join("").slice((i * 4), (i * 4 + 4))]);
	    };

	    return `${charGroups[0]}-${charGroups[1]}-${charGroups[2]}-${charGroups[3]}`;
	};



}); // END document ready

/*
const knob_rotate = document.querySelector(".knob_cap");

		const knob = {
			name: "rotate",
			active: false,
			outputValue: 0,
			currentY: 0,
			currentX: 0
		};

		// Sets intital Y value of click, sets active to true
		const dragStart = function(){

			if(event.target === knob_rotate){
				knob.active = true;
			};
		};

		// Only fires if active is set to true
		const drag = function(){

			if(knob.active === true){

				if(event.clientY - knob.currentY > 0 && knob.outputValue > -135){
					knob.outputValue -= 5;
				} else if(event.clientY - knob.currentY < 0 && knob.outputValue < 135){
					knob.outputValue += 5;
				} 
				knob.currentY = event.clientY;
			};

			rotateKnob();
		};

		// Saves final value of drag, sets active to false
		const dragEnd = function(){

			knob.active = false
		};

		// Sets knob to rotate based on current value
		const rotateKnob = function(){

			knob_rotate.style.transform = `rotate(${knob.outputValue}deg)`;
		};

		knob_rotate.addEventListener("mousedown", dragStart);

		document.addEventListener("mouseup", dragEnd);

		document.addEventListener("mousemove", drag);
		*/