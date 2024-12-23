/*******************************************************************************
*
*	@file mesh.js
*	@brief Mesh file with all the classes necessary to create a face vertex
*		representation of a mesh
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 09-August-2019
*
*******************************************************************************/

class Face {
	constructor(vertex1, vertex2, vertex3) {
		let verticies = [vertex1, vertex2, vertex3];
		this.v1 = vertex1;
		this.v2 = vertex2;
		this.v3 = vertex3;
	}

	midPoint() {
		const midx = (this.v1.x + this.v2.x + this.v3.x) / 3;
		const midy = (this.v1.y + this.v2.y + this.v3.y) / 3;
		return new Vertex(midx, midy);
	}

	linesInterset(a1, a2, b1, b2) {
		// infinite gradient parallel line case
		if(a1.x == a2.x && b1.x == b2.x) {
			return false;
		}

		// infinite gradient case
		// if(a1.x === a2.x) {
		// 	if(min(b1.x, b2.x) <= a1.x && max(b1.x, b2.x) >= a1.x) {
		// 		const mb = (b2.y - b1.y) / (b2.x - b1.x);
		// 		let y = mb * a1.x + b1.y;
		// 		if(y < max(a1.y, a2.y) && y > min(a1.y, a2.y)) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// }

		// if(b1.x === b2.x) {
		// 	if(min(a1.x, a2.x) <= b1.x && max(a1.x, a2.x) >= b1.x) {
		// 		const ma = (a2.y - a1.y) / (a2.x - a1.x);
		// 		let y = ma * b1.x + a1.y;
		// 		if(y < max(b1.y, b2.y) && y > min(b1.y, b2.y)) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// }

		// check for non infinite gradient parallel lines
		const ma = (a2.y - a1.y) / (a2.x - a1.x);
		const mb = (b2.y - b1.y) / (b2.x - b1.x);

		if(ma == mb) {
			return false;
		}

		// general case
		const xIntersect = (ma * a1.x - mb * b1.x + b1.y - a1.y) / (ma - mb);

		if(xIntersect < min(a1.x, a2.x) || xIntersect > max(a1.x, a2.x)) {
			return false;
		}

		if(xIntersect < min(b1.x, b2.x) || xIntersect > max(b1.x, b2.x)) {
			return false;
		}
		return true;
	}

	getCCWVertexList(sharedVerticies=[]) {
		// what is the chance that the top most vertex is also inline with the
		// right most vertex of the remaining pair
		let vertexList = [this.v1, this.v2, this.v3];

		const mid = this.midPoint();
		// sort into counter clockwise order
		vertexList.sort((a, b) => atan2(b.y - mid.y, b.x - mid.x) - atan2(a.y - mid.y, a.x - mid.x) );

		if(sharedVerticies.length == 0) {
			return vertexList;
		}

		// make sure that the shared vertices are the first and last element
		let vl = vertexList;
		const permuteVal = 1;

		for(let i = 0; i < 4; i++) {
			const v1isShared = sharedVerticies.includes(vl[0]);
			const v2isShared = sharedVerticies.includes(vl[2]);

			if(v1isShared && v2isShared) {
				// console.log("CCW vertexorder");
				// console.log(vl);
				return vl;
			}

			vl = vl.slice(permuteVal).concat(vl.slice(0, permuteVal));
		}
		return vl;
	}

	bounds(vertex) {
		const mid = this.midPoint();

		const d = dist(mid.x, mid.y, vertex.x, vertex.y);
		const r1 = dist(this.v1.x, this.v1.y, mid.x, mid.y);
		const r2 = dist(this.v2.x, this.v2.y, mid.x, mid.y);
		const r3 = dist(this.v3.x, this.v3.y, mid.x, mid.y);

		const r = Math.max(r1, r2, r3);

		if(d > r) {
			return false;
		}

		if(this.linesInterset(mid, vertex, this.v1, this.v2)) {
			return false;
		}

		if(this.linesInterset(mid, vertex, this.v1, this.v3)) {
			return false;
		}

		if(this.linesInterset(mid, vertex, this.v2, this.v3)) {
			return false;
		}
		return true;
	}

	sharesEdge(face) {
		const allVerticies = [this.v1, this.v2, this.v3,
			face.v1, face.v2, face.v3];

		const setOfVerticies = new Set(allVerticies);

		if(setOfVerticies.size == 4) {
			return true;
		}
		return false;
	}

	sharedVerticies(face) {
		let sharedVerticies = [];
		const f1vertexList = [this.v1, this.v2, this.v3];
		const f2vertexList = [face.v1, face.v2, face.v3];

		for(let i = 0; i < 3; i++) {
			if(f2vertexList.includes(f1vertexList[i])) {
				sharedVerticies = sharedVerticies.concat(f1vertexList[i]);
			}
		}
		return sharedVerticies;
	}

	draw(fillAlpha = 0) {
		push();
		fill(0, fillAlpha);
		strokeWeight(1);
		stroke(0);
		beginShape();
		vertex(this.v1.x, this.v1.y);
		vertex(this.v2.x, this.v2.y);
		vertex(this.v3.x, this.v3.y);
		endShape(CLOSE);
		pop();
	}
}

class Vertex {
	constructor(x, y, faces = []) {
		this.x = x;
		this.y = y;
		this.faces = faces;
	}

	isEqual(v) {
		return this.x == v.x && this.y == v.y;
	}

	addFace(newFace) {
		this.faces.push(newFace);
	}

	removeFace(oldFace) {
		for(let i = this.faces.length - 1; i >= 0; i--) {
			if(this.faces[i] === oldFace) {
				this.faces.splice(i, 1);
				return;
			}
		}
	}
}

class Mesh {
	constructor(faces, verticies) {
		this.faces = faces;
		this.verticies = verticies;
		this.flipIndex = 0;
	}

	addVertex(vertex) {
		if(this.verticies.includes(vertex)) {
			console.log("This vertex is already in the mesh");
			console.log(vertex);
			return;
		}

		for (let i = this.faces.length - 1; i >= 0; i--) {
			if(this.faces[i].bounds(vertex)) {
				const oldFace = this.faces[i];
				oldFace.v1.removeFace(oldFace);
				oldFace.v2.removeFace(oldFace);
				oldFace.v3.removeFace(oldFace);

				this.faces.splice(i, 1);

				const face1 = new Face(oldFace.v1, oldFace.v2, vertex);
				oldFace.v1.addFace(face1);
				oldFace.v2.addFace(face1);
				vertex.addFace(face1);

				const face2 = new Face(oldFace.v1, oldFace.v3, vertex);
				oldFace.v1.addFace(face2);
				oldFace.v3.addFace(face2);
				vertex.addFace(face2);

				const face3 = new Face(oldFace.v2, oldFace.v3, vertex);
				oldFace.v2.addFace(face3);
				oldFace.v3.addFace(face3);
				vertex.addFace(face3);

				this.faces.push(face1);
				this.faces.push(face2);
				this.faces.push(face3);

				this.verticies.push(vertex);
				return;
			}
		}
	}

	testCheck(face1, face2) {
		console.log("Start Test Check----------------------------------------");
		console.log("Face 1:");
		console.log(face1);
		console.log("Face 2:");
		console.log(face2);

		//---------------------------------------------------------------------
		const sharedVerticies = face1.sharedVerticies(face2);

		const verticies1 = face1.getCCWVertexList(sharedVerticies);
		const verticies2 = face2.getCCWVertexList(sharedVerticies);

		const allVerticies = verticies1.concat(verticies2);
		const setOfVerticies = [...verticies1, verticies2[1]];
		//---------------------------------------------------------------------

		console.log("Face 1 CCW List: ");
		console.log(verticies1);
		console.log("Face 2 CCW List: ");
		console.log(verticies2);

		console.log("sharedVerticies: ");
		console.log(sharedVerticies);

		console.log("CCW Ordered Set of Verticies: ");
		console.log(setOfVerticies);

		console.log("End Test Check------------------------------------------");
	}

	isLastVertexInCircumCircle(verticies) {
		const a = verticies[0];
		const b = verticies[1];
		const c = verticies[2];
		const d = verticies[3];
		let matrix = [
			[a.x, a.y, a.x**2 + a.y**2, 1],
			[b.x, b.y, b.x**2 + b.y**2, 1],
			[c.x, c.y, c.x**2 + c.y**2, 1],
			[d.x, d.y, d.x**2 + d.y**2, 1]
			];

		return math.det(matrix) > 0;
	}

	delaunayFlip() {
		if(this.flipIndex >= this.verticies.length) {
			this.flipIndex = 0;
			return;
		}

		const vertex = this.verticies[this.flipIndex];
		const faces = vertex.faces;

		for(let i = 0; i < faces.length; i++) {
			for(let j = 0; j < faces.length; j++) {
				if(i == j) {
					continue;
				}

				if(faces[i].sharesEdge(faces[j])) {
					//check delaunay and flip if necssaryo
					const sharedVerticies = faces[i].sharedVerticies(faces[j]);

					const verticies1 = faces[i].getCCWVertexList(sharedVerticies);
					const verticies2 = faces[j].getCCWVertexList(sharedVerticies);

					const allVerticies = verticies1.concat(verticies2);
					const setOfVerticies = [...verticies1, verticies2[1]];

					// testCheck(face[i], face[j]);

					if(this.isLastVertexInCircumCircle(setOfVerticies)) {
						//flip edge;
						console.log("Flip Edge");
						console.log(sharedVerticies);
						push();
						stroke("#ff0000");
						line(sharedVerticies[0].x, sharedVerticies[0].y,
							sharedVerticies[1].x, sharedVerticies[1].y);
						pop();

						// return;
					} else {
						console.log("No Flip");
						push();
						stroke("#00ff00");
						line(sharedVerticies[0].x, sharedVerticies[0].y,
							sharedVerticies[1].x, sharedVerticies[1].y);
						pop();
						noLoop();
					}
				}
			}
		}
		this.flipIndex++;
	}

	draw() {
		for (let i = this.faces.length - 1; i >= 0; i--) {
			const mouseVertex = new Vertex(mouseX, mouseY);
			if(this.faces[i].bounds(mouseVertex)) {
				this.faces[i].draw(50);
			} else {
				this.faces[i].draw();
			}
		}
		this.delaunayFlip();
	}
}