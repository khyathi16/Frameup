async function createPost() {

    const postInput =
        document.getElementById('postInput');

    const postText = postInput.value;

    if(postText === '') {

        alert("Write something!");

        return;
    }
    const imageInput =
    document.getElementById('imageInput');

    await fetch('/create-post', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

       body: JSON.stringify({

    username:
    localStorage.getItem('username'),

    profilePic:
    localStorage.getItem('profilePic'),

    content: postText,

    image: imageInput.value
})
    });

    postInput.value = '';
    imageInput.value = '';

    loadPosts();
}


async function loadPosts() {

    const response =
        await fetch('/posts');

    const posts =
        await response.json();

    const postsContainer =
        document.getElementById('postsContainer');

    postsContainer.innerHTML = '';

    posts.forEach(post => {

        postsContainer.innerHTML += `

        <div class="post">

            <div class="post-header">

                <img src="${post.profilePic}">

                <h3>${post.username}</h3>

            </div>

            <div class="post-content">

    <img
        src="${post.image}"
        class="post-image"
    >

    <p>${post.content}</p>

</div>

            <div class="post-actions">

    <i
        class="fa-heart fa-solid like-btn"
        onclick="likePost(this, '${post._id}')"
    ></i>

    ${post.likes} Likes

    <i
        class="fa-regular fa-comment comment-btn"
        onclick="showCommentBox('${post._id}')"
    ></i>

</div>

<div
    id="commentBox-${post._id}"
    class="comment-box"
    style="display:none;"
>

    <input
        type="text"
        id="commentInput-${post._id}"
        placeholder="Write comment..."
    >

    <button onclick="addComment('${post._id}')">

        Comment

    </button>

</div>

<div class="comments">

    ${post.comments.map(comment => `
        <p>💬 ${comment}</p>
    `).join('')}

</div>

        </div>
        `;
    });
}

loadPosts();
async function likePost(id) {

    await fetch(`/like-post/${id}`, {

        method: 'POST'
    });

    loadPosts();
}
function logout() {

    localStorage.removeItem('username');

    window.location.href = 'login.html';
}
async function likePost(element, id) {

    await fetch(`/like-post/${id}`, {

        method: 'POST'
    });

    element.style.color = 'red';

    loadPosts();
}


function showCommentBox(id) {

    const box =
    document.getElementById(

        `commentBox-${id}`
    );

    if(box.style.display === 'none') {

        box.style.display = 'block';
    }

    else {

        box.style.display = 'none';
    }
}


async function addComment(id) {

    const input =
    document.getElementById(

        `commentInput-${id}`
    );

    const comment =
    input.value;

    await fetch(`/comment/${id}`, {

        method: 'POST',

        headers: {

            'Content-Type':
            'application/json'
        },

        body: JSON.stringify({

            comment
        })
    });

    loadPosts();
}

