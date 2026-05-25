const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));
app.use(express.json());

mongoose.connect(
'mongodb+srv://pandu160207_db_user:khyathi16@khyathi.zlgicuc.mongodb.net/FameUp?retryWrites=true&w=majority'
)

.then(() => {

    console.log("MongoDB Connected");
})

.catch((err) => {

    console.log(err);
});



app.get('/', (req, res) => {

    res.redirect('/login.html');
});

const userSchema = new mongoose.Schema({

    username: String,

    email: String,

    password: String,

    followers: {

        type: Number,

        default: 0
    },

    following: {

        type: Number,

        default: 0
    },

    bio: {

        type: String,

        default: "Welcome to FameUp 🚀"
    },
    profilePic: {

    type: String,

    default:
    "https://randomuser.me/api/portraits/men/32.jpg"
}
});



const User = mongoose.model('User', userSchema);



const postSchema = new mongoose.Schema({

    username: String,

    content: String,

    image: String,

    profilePic: String,

    likes: {
    type: Number,
    default: 0
},

comments: {
    type: Array,
    default: []
}
});

const Post = mongoose.model('Post', postSchema);


app.post('/register', async (req, res) => {

    const user = new User(req.body);

    await user.save();

    res.send('Registration Successful');
});


app.post('/login', async (req, res) => {

    const user = await User.findOne({

        email: req.body.email,

        password: req.body.password
    });

    if(user) {

        res.json({

            success: true,

            username: user.username
        });
    }

    else {

        res.json({

            success: false
        });
    }
});



app.post('/create-post', async (req, res) => {

    const post = new Post({

        username: req.body.username,

        profilePic: req.body.profilePic,

        content: req.body.content,

        image: req.body.image
    });

    await post.save();

    res.send('Post Created');
});



app.get('/posts', async (req, res) => {

    const posts = await Post.find()

    .sort({ _id: -1 });

    res.json(posts);
});



app.post('/like-post/:id', async (req, res) => {

    await Post.findByIdAndUpdate(

        req.params.id,

        {

            $inc: {

                likes: 1
            }
        }
    );

    res.send('Post Liked');
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});
app.get('/profile/:username', async (req, res) => {

    const user = await User.findOne({

        username: req.params.username
    });

    const posts = await Post.find({

        username: req.params.username
    });

    res.json({

        followers: user.followers,

        following: user.following,

        bio: user.bio,

        posts: posts.length,

        profilePic: user.profilePic
    });
});
app.post('/follow/:username', async (req, res) => {

    const user = await User.findOne({

        username: req.params.username
    });

    user.followers += 1;

    await user.save();

    res.send('Followed');
});
app.post('/update-profile-pic', async (req, res) => {

    await User.updateOne(

        {

            username: req.body.username
        },

        {

            profilePic: req.body.profilePic
        }
    );

    res.send('Profile Photo Updated');
});
app.post('/comment/:id', async (req, res) => {

    await Post.findByIdAndUpdate(

        req.params.id,

        {
            $push: {

                comments: req.body.comment
            }
        }
    );

    res.send('Comment Added');
});