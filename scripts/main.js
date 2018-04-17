//load in jquery first
//anything with ID in the STATE
//need form listener since we are waiting for ppl to submit the form. Find the form in html
$(function(){//this kicks off the code. This is the same as document.ready. Insures this only runs when everything ready.
    //page has loaded -- need to pull old coffee orders from LocalStorage
    var orders = [];//array because we are getting a list or orders. This is not changing behavior, just reorgnizing here. This just keeps track of every order that has been submitted. If we have saved stuff to local storage -- want to pull out and put into this array
    var oldOrdersJSON = localStorage.getItem("coffeeOrders");//be particular about what info we need. We saved this info under CoffeeOrders. Tagged JSON at the end because what we saved in the first place was a JSON thing
    var oldOrders = JSON.parse(oldOrdersJSON);//turning this back into JavaScript. Converted it back into format we can use
    
    if (oldOrders) {
        orders = oldOrders;
    }// carry on as usual. now orders array has all old orders. WE still need to show orders to the screen when page reloads.... We could omit the oldOrders != null, but this makes it easier to read. Otherwise we don't really know what OldOrders is. THis is our catch code in case someone deletes our local storage

    //makes sure code can still run without local storage^^#handling the edgecase
    
    var oldOrdersHTML = "";//we will attach some things to this empty string below. Takes each coffeeOrder separately and attaches it to HTML. 
    orders.forEach(function(currentOrder){//by the end of this loop oldOrdersHTML is going to be a bunch of HTML, and the last job will be just to show it to the screen.
        oldOrdersHTML += renderCoffeeOrder(currentOrder);//we have already pulled information from LocalStorage 
    });//loop over all previous orders. //renderCoffee order will take an order and spit out the string of HTML. Called the parameter currentOrders so we are aware that we are actively looping over all of our orders
    $('#orderList').append(oldOrdersHTML);

    function renderCoffeeOrder(order) {//render functions take information and turn it into HTML string. This is taking information from currentOrder. Taking order as a parameter. THis function's job is to render 1 coffeeOrder
        var finalHTML = '<div class="order" data-id="'+ order.id +'">';//this will print out a string of HTML. the data-id part tells JavaScript "hey don't worry about this I am just using this for my own sake." This particular dataID is set to orderID. I've imbedded this unique ID in the HTML itself so if I need this information later I can easily pull it up

        finalHTML += '<span>'+ order.coffeeOrder +'</span>';
        finalHTML += '<span>'+ order.email +'</span>';
        finalHTML += '<span>'+ order.size +'</span>';
        finalHTML += '<span>'+ order.flavorShot +'</span>';
        finalHTML += '<span>'+ order.strength +'</span>';
        finalHTML += '<button class="delete">X</button>';
        finalHTML += '</div>';

        return finalHTML;

        //^^this finalHTML stuff is adding things to html based on the order thts being passed
    }

    //Listen for when people submit the form

    $('form').submit(function(e){//can j ust say "form" because its the only form on the html page. We are selecting the 'form' with jQuery. Upon submission, then our function will run. Function is anonymous at this point. We could also select by attribute here: [data-coffee-order](see HTML). If there was more than one form probably end up using an ID or CLass, most likely class. Need the e so that the page is not automatically refreshing. That is default behavior of a form, an we do not want default behavior--so we add the e as the event behavior in submit funciton.
            //code inside here will execute every time form is submitted. We know when someone hits submit, its going to show something to the screen later. There are 5 different things that can be pulled out from this form
            e.preventDefault();//this is an example of debugging in the middle of an application
            //maybe define variables, set them equal to the values of the form fields
            //the only job of this function is to write ONE coffee order. Just a matter of preference
            var currentOrder = {//now we have one object with 5 keys..much better. //we have submitted a form and now we have variables of what we just entered. Take the order information and render it to the screen somewhere. All of these keys are pointing to something on the page
                    id: new Date(),//this is a timestamp. Now there will be An ID to separate orders when we create them. THis will not be visible to the users. newDate will return a string of the timeStamp
                    coffeeOrder: $('#coffeeOrder').val(),//coffeeOrder is equal to whatever is inside the coffeeOrder element--in this case it is an input Tag
                    email: $('#emailInput').val(),
                    size: $('input:checked').val(),//perfect for radio buttons because only one radio button can be checked at a time(small, tall, grande)
                    flavorShot: $('#flavorShot').val(),//this is a select dropdown. 
                    strength: $('#strengthLevel').val()//ID to select the tag, .val to find out current level
            };

            orders.push(currentOrder);//pushing current order to order array
            //Show new order to the screen
            var renderedHTML = renderCoffeeOrder(currentOrder);//created another variable(perfectly legal). It's going to be equal to this renderCoffeeOrder function we defined. WHatever the function returns is what the variable will be next. Passing in CurrentOrder. At this point we still don't know what we will do with th HTML or where it will go. Thought process "Now that we have a coffee order that we want to show, lets call our function for the order and sprint out the string"
        
            //get the renderedHTML ^^^ to show up in the DOM. 
            $('#orderList').append(renderedHTML);//selected current container div and added the new order that was just submitted
            //Saves to local storage below. This information by itself will not make the orders appear on the page. Still need to pull from LocalStorage
            var ordersJSON = JSON.stringify(orders);//ordersJSON is a string
            localStorage.setItem("coffeeOrders", ordersJSON);//ordersJason string format -- but holds exact information as orders. Saves it to local storage

    });
    
    $('#orderList').on('click', '.delete', function(){//this click listener will still work for new orders that show up
        //remove the right order object from orders
        var idToDelete = $(this).parent().data("id");//this refers to the actual HTML element that was clicked(the button). .parent() is going to take whatever we just selected and return whatever element owns THIS. IN this case, the parent of the button is '<div class="order">'. The .data extracts our custom attribute("ID")
        //make sure our order gets removed from our orders array(removed from the screen)
        orders = orders.filter(function(currentOrder){//removing the thing that doesn't belong
            return currentOrder.id != idToDelete;
        });//with filter, if it returns true that means "dont remove". Thats why we changed from == to !=
        //make sure the order gets removed from localStorage too
        var ordersJSON = JSON.stringify(orders);//turning this into a JSON string that looks like an array. ordersJSON is a string
        localStorage.setItem("coffeeOrders", ordersJSON);//this is sticking it to local storage. refers to local storage(given to us by default). The function we're using is setItem -- this takes two parameters--the label(key), and the data(value). Can't save an array here, has to be a string. So we use ordersJson -- this holds the exact same thing as (orders), just in string format
        $(this).parent().remove();
        //remove the right order object from orders
    });//this makes sure that the click listener still works new coffeeOrders. if we did $('.delete).click(function(){ it wouldn't work because its not reusable.}. 



});


//write some HTML in index.html. Right now it is just the form. Make some divs inside "section"<div id = "orderList"
//a good way to use a unique ID is with a timeStamp