var git = require( '../build/default/git2' ),
    rimraf = require( '../vendor/rimraf'),
    fs = require( 'fs' );


// Helper functions
var helper = {
  // Test if obj is a true function
  testFunction: function( test, obj, label ) {
    // The object reports itself as a function
    test( typeof obj, 'function', label +' reports as a function.' );
    // This ensures the repo is actually a derivative of the Function [[Class]]
    test( toString.call( obj ), '[object Function]', label +' [[Class]] is of type function.' );
  },
  // Test code and handle exception thrown 
  testException: function( test, fun, label ) {
    try {
      fun();
      test( false, label );
    }
    catch (ex) {
      test( true, label );
    }
  }
};

// Repo
exports.constructor = function( test ){
  test.expect( 3 );

  // Test for function
  helper.testFunction( test.equals, git.Repo, 'Repo' );
  
  // Ensure we get an instance of Repo
  test.ok( new git.Repo() instanceof git.Repo, 'Invocation returns an instance of Repo' );

  test.done();
};

// Repo::Open
exports.open = function( test ) {
  var testRepo = new git.Repo();

  test.expect( 8 );

  // Test for function
  helper.testFunction( test.equals, testRepo.open, 'Repo::Open' );

  // Test path argument existence
  helper.testException( test.ok, function() {
    testRepo.open();
  }, 'Throw an exception if no path' );
 
  // Test callback argument existence
  helper.testException( test.ok, function() {
    testRepo.open( "some/path" );
  }, 'Throw an exception if no callback' );

  // Test that both arguments result correctly
  helper.testException( test.ifError, function() {
    testRepo.open( "some/path", function() {} );
  }, 'No exception is thrown which proper arguments' );

  // Test invalid repository
  testRepo.open( '/etc/hosts', function( err, path ) {
    test.equals( -8, err, 'Invalid repository error code' );

    // Test valid repository
    testRepo.open( './.git', function( err, path ) {
      test.equals( 0, err, 'Valid repository error code' );

      // Test path returned is correct
      test.equals( './.git', path, 'Path return matches sent' );

      test.done();
    });
  });
};

// TODO: Figure out how write unit tests for free
// Repo::Free
exports.free = function( test ) {
  var testRepo = new git.Repo();

  test.expect( 2 );

  // Test for function
  helper.testFunction( test.equals, testRepo.free, 'Repo::Free' );

  test.done();
};

// Repo::Init
exports.init = function( test ) {
  var testRepo = new git.Repo();

  test.expect( 4 );

  // Test for function
  helper.testFunction( test.equals, testRepo.init, 'Repo::Init' );

  // Cleanup, remove test repo directory - if it exists
  rimraf( './test.git', function() {
    // Create bare repo and test for creation
    testRepo.init( './test.git', true, function( err, path ) {
      test.equals( 0, err, 'Successfully created bare repository' );
      // Verify repo exists
      testRepo.open( './test.git', function(err, path) {
        test.equals( 0, err, 'Valid repository created' );
          // Cleanup, remove test repo directory
          rimraf( './test.git', function() {
            test.done();
          });
      });
    });
  });
};
