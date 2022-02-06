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

	getCCWVertexList() {
		// what is the chance that the top most vertex is also inline with the
		// right most vertex of the remaining pair
		vertexList = [];
		options = [this.v1, this.v2, this.v3];

		// find top most vertex
		// do checks for equal y values first
		if(options[0].y < options[1].y && options[0].y < options[2].y) {
			vertexList.push(options[0]);
			options.splice(0, 1);
		} else if(options[1].y < options[2].y) {
			vertexList.push(options[1]);
			options.splice(1, 1);
		} else {
			vertexList.push(options[2]);
			options.splice(2, 1);
		}

		// find left vertex from remaining pair
		if(options[0] < options[1]) {
			vertexList.push(options[0]);
			options.splice(0, 1);
		} else {
			vertexList.push(options[1]);
			options.splice(1, 1);
		}

		// add last vertex
		vertexList.push(options[0]);
		return vertexList;
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

	delaunayFlip() {
		if(flipIndex > this.verticies.length) {
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
					//check delaunay and flip if necssary
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
	}
}