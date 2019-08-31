function isJSON(str) {
	if (str == "") return false;
	str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
	str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
	str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
	return (/^[\],:{}\s]*$/).test(str);
}

QUnit.test( "Hello Test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "Validate JSON", function( assert ) {
  assert.ok( isJSON("{ }") == true, "Passed");
});