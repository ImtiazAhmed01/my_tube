console.log('video script added')
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then((res) => res.json())
        .then(data => displayCategories(data.categories))
        .catch((error) => console.log(error))

}
const loadVideos = (searchText = '') => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then((res) => res.json())
        .then(data => displayVideos(data.videos))
        .catch((error) => console.log(error))

}

const loadCategoryVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then((res) => res.json())
        .then(data => {
            removeActiveClass();
            const activebtn = document.getElementById(`btn-${id}`)
            activebtn.classList.add("active")
            displayVideos(data.category)
        })
        .catch((error) => console.log(error))
}

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('categories')
    categories.forEach((item => {
        const buttonContainer = document.createElement("div");
        // button.classList = 'btn';
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">
        ${item.category}
        </button>`

        categoryContainer.append(buttonContainer);
    }))

}
function getTimeString(time) {
    const hour = parseInt(time / 3600);

    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour ${minute} minute ${remainingSecond} second ago`;
}

const loadDetails = async (videoId) => {

    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetials(data.video);

};

const displayDetials = (video) => {
    const detailContainer = document.getElementById('modalContent');
    detailContainer.innerHTML = `
    <img src='${video.thumbnail}'/>
    <p>${video.description} </p>
    `
    document.getElementById('customModal').showModal();
}


const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = '';
    if (videos.length == 0) {
        videoContainer.classList.remove("grid");
        videoContainer.innerHTML = `
        <div class='min-h-[300px] w-full flex flex-col gap-5 justify-center items-center'>
            <img src="icon/Icon.png" />
            <h2 class='text-center font-bold text-xl'>No content in this category</h2>
        </div>`;
        return
    }
    else {
        videoContainer.classList.remove("grid");
    }
    videos.forEach(video => {
        const card = document.createElement('div');
        card.classList = 'card card-compact'
        card.innerHTML = `
        <figure class ='h-[200px]'>
            <img class='h-full w-full object-cover'
            src="${video.thumbnail}"
            alt="Shoes" />
            ${video.others.posted_date?.length == 0 ? "" : `<span class='absolute right-1 mt-36 bg-black rounded p-1 text-white'>${getTimeString(video.others.posted_date)} </span>`}

            
        </figure>
        <div class="px-0 py-2 flex gap-2">
            <div> 
                <img class='w-10 h-10 rounded-full' src="${video.authors[0].profile_picture}" />
            </div>
            <div>
                <h2 class='font-bold'>${video.title}</h2>
                <div class='flex items-center gap-2'>
                    <p class="text-gray-400">${video.authors[0].profile_name}</p>
                    ${video.authors[0].verified == true ? '<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" />' : ' '}
                </div>
                <p>
                    <button onclick="loadDetails('${video.video_id}')" class='btn btn-sm btn-error'> Details </button>
                </p>
            </div>
        </div>
        `
        videoContainer.append(card);
    })
}
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn');
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
}
document.getElementById('search-input').addEventListener('keyup', (e) => {
    loadVideos(e.target.value)
})


loadCategories();
loadVideos();