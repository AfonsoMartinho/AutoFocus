apiCaller2 = function (url) {
    //use request to make the external http call to the JSON api
    Jquery.ajax({
      url: url,
      type: 'GET',
      success:function(result){
        return result
      },
      error: function (error){
        console.log('ERROR ${error}')
      } 
    })
  };