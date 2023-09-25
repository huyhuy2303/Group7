const express = require("express")
const path = require("path")
const app = express()
const bcrypt = require('bcrypt');

// const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'Template')));

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

// Serve static files from the "images" directory
app.use("/images", express.static(path.join(__dirname, "public/images")));

// hbs.registerPartials(partialPath)
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

 app.get('/home', (req, res) => {
     res.render('home')
 })

 app.get('/product', (req, res) => {
    res.render('product')
})

app.get('/shipper', (req, res) => {
    res.render('shipper')
})

app.get('/vendor', (req, res) => {
    res.render('vendor')
})

const saltRounds = 10;

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the username or email already exists in the database
        const existingUser = await LogInCollection.findOne({ $or: [{ name }, { email }] });

        if (existingUser) {
            return res.send("User with the same username or email already exists");
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password and role
        const newUser = new LogInCollection({
            name,
            email,
            password: hashedPassword,
            role, // Include the selected role
        });

        // Save the user to the database
        await newUser.save();

        // Determine the redirect URL based on the selected role
        let redirectURL;
        if (role === 'shipper') {
            redirectURL = '/shipper'; // Modify the URL accordingly
        } else if (role === 'vendor') {
            redirectURL = '/vendor'; // Modify the URL accordingly
        } else if (role === 'customer') {
            redirectURL = '/homepage'; // Modify the URL accordingly
        }

        // Redirect to the selected role-specific page
        res.redirect(redirectURL);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred: " + error.message);
    }
});



app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find the user by username
        const user = await LogInCollection.findOne({ name });

        // Check if the user exists and the password matches
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.send("Incorrect username or password");
        }

        // Determine the redirect URL based on the user's role
        let redirectURL;
        if (user.role === 'shipper') {
            redirectURL = '/shipper'; // Modify the URL accordingly
        } else if (user.role === 'vendor') {
            redirectURL = '/vendor'; // Modify the URL accordingly
        } else if (user.role === 'customer') {
            redirectURL = '/customer'; // Modify the URL accordingly
        }

        // Redirect to the corresponding role-specific page
        res.redirect(redirectURL);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred: " + error.message);
    }
});

app.post('/product', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check && check.password === req.body.password) {
            res.status(201).render("homepage", { naming: `${req.body.name}` })
        } else {
            res.send("Incorrect username or password")
        }
    } catch (error) {
        res.send("Error occurred: " + error.message)
    }
})


app.listen(port, () => {
    console.log('port connected');
})