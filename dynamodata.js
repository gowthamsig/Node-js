//package to read json files
var jsonfile = require('jsonfile');
//AWS node sdk
var AWS = require('aws-sdk');
 var fs = require('fs');
 var dateformat = require('dateformat');
 
//need to update region in config
AWS.config.update({
    region: "us-east-1"
});
 
//create a doc client to allow using JSON directly
var docClient = new AWS.DynamoDB.DocumentClient();
 
//prepared JSON file
//[{ ... }, { ... }]
var placeFile = 'data/testsample.json';
//var placeArray = jsonfile.readFileSync(placeFile);
var placeArray = JSON.parse(fs.readFileSync('data/amazondata.json', 'utf8'));
//utility function to create a single put request
function getPlace(index){
    return {
        TableName: "Sales",
		Item:{ 
		"Vendor": placeArray[index].Vendor,
		"Order_Date": dateformat(placeArray[index].Order_Date, "yyyy-mm-dd"),
		"Row_ID": placeArray[index].Row_ID,
		"Order_ID":placeArray[index].Order_ID,
		"Order_Priority":placeArray[index].Order_Priority,
		"Order_Quantity":placeArray[index].Order_Quantity,
		"Sales":placeArray[index].Sales,
		"Discount":placeArray[index].Discount,
		"Ship_Mode":placeArray[index].Ship_Mode,
		"Profit":placeArray[index].Profit,
		"Unit_Price":placeArray[index].Unit_Price,
		"Shipping_Cost":placeArray[index].Shipping_Cost,
		"Customer_Name":placeArray[index].Customer_Name,
		"Province":placeArray[index].Province,
		"Region":placeArray[index].Region,
		"Customer_Segment":placeArray[index].Customer_Segment,
		"Product_Category":placeArray[index].Product_Category,
		"Product_Sub_Category":placeArray[index].Product_Sub_Category,
		"Product_Name":placeArray[index].Product_Name,
		"Product_Container":placeArray[index].Product_Container,
		"Product_Base_Margin":placeArray[index].Product_Base_Margin,
		"Ship_Date":placeArray[index].Ship_Date
		}
    };
}
 
//recursive function to save one place at a time
function savePlaces(index){
    if(index == placeArray.length){
        console.log("saved all.");
        return;
    }
 
    var params = getPlace(index);
    //spit out what we are saving for sanity
    console.log(JSON.stringify(params));
    //use the client to execute put request.
    docClient.put(params, function(err, data) {
        if (err) {
            console.log(err);
        }else{
            console.log("saved Place item "+index);
            index += 1;
            //save the next place on the list
            //with half a second delay
            setTimeout(function(){
                savePlaces(index);
            }, 50);
        }
    });
}
 
//start saving from index - 0
savePlaces(0);