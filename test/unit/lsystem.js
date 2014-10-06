QUnit.test("LSystem Tests", function() {
  var lsystem = new LSystem('F', { 'F': 'FA' });
  assert.ok( lsystem.derive(1) == "FA", "Passed!" );
  assert.ok( lsystem.derive(2) == "FAA", "Passed!" );
  assert.ok( lsystem.derive(3) == "FAAA", "Passed!" );
});
