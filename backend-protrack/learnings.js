// Importing the sequelize module in every model file should not make your application heavy because Node.js caches the imported modules. When you import a module in Node.js, it is cached so that subsequent calls to the same module can be served from the cache, which is much faster than re-loading the module each time.

// So, if you import the sequelize module in multiple files, 
// Node.js will only load the module once and cache it for subsequent uses. 
// Therefore, 
// importing the sequelize module in every model file should not have a significant impact on your application's performance or memory usage.





// Both Sequelize.INTEGER and DataTypes.INTEGER refer to the same data type and can be used interchangeably.
// The DataTypes object is just a reference to the data types provided by Sequelize, so you can use it as a shortcut to define your model attributes.
// However, using Sequelize.INTEGER is more explicit and clear in terms of defining the data type for your model attribute. Using DataTypes.INTEGER may be preferred for brevity or consistency if you're using the DataTypes object for other attributes as well.









/*
Importing modules in each file where they are used is a common practice in Node.js applications. 
It does not significantly affect the performance of your application as long as you are not creating new instances of the modules unnecessarily.
In the case of Sequelize, it is a lightweight module and importing it in each model file should not cause any significant performance issues.
Regarding other modules like express, jwt, passport, it is generally recommended to import them only once in your main application file and pass them as dependencies to other modules that need them. 
This approach is called dependency injection, and it helps to reduce the number of duplicate module imports and promote better code organization.
However, even if you import these modules in each file where they are used, it should not significantly affect the performance of your application as long as you are not creating new instances of the modules unnecessarily.


*/