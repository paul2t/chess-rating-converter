
const ratings_conversions = new Map([
    ["chesscom-rapid", [ 0.751343974, 461.6457348 ] ],
    ["lichess-rapid", [ 0.629819174, 948.7785739 ] ],
    ["chesscom-blitz", [ 1.0, 0.0 ] ],
    ["lichess-blitz", [ 0.765847834, 616.0098942 ] ],
    ["chesscom-bullet", [ 1.036516455, -112.4543786 ] ],
    ["lichess-bullet", [ 0.866000904, 373.1784651 ] ],
    ["lichess-classical", [ 0.526433189, 1070.387055 ] ],
    ["uscf", [ 0.871758094, 172.2566092 ] ],
    ["fide", [ 0.805617647, 284.9338235 ] ],
]);


document.getElementById("input-rating").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-rating-type").addEventListener("change", (event) => on_ratings_params_changed());
init_from_url_parameter();


function init_from_url_parameter() {
    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);
    const rating = url_params.get('rating');
    const type = url_params.get('from');
    
    if (rating != null)
        document.getElementById("input-rating").value = rating;
    if (type != null)
        document.getElementById("input-rating-type").value = type;

    update_ratings();
}

function on_ratings_params_changed() {
    const input_rating_value = document.getElementById("input-rating").value;
    const input_rating_type = document.getElementById("input-rating-type").value;

    let params = new URLSearchParams();
    if (input_rating_value != "")
        params.set('rating', input_rating_value)
    params.set('from', input_rating_type);
    const new_url = `${location.pathname}?${params}`;
    history.replaceState(null, '', new_url);

    update_ratings_with(input_rating_value, input_rating_type);
}

function update_ratings() {
    const input_rating_value = document.getElementById("input-rating").value;
    const input_rating_type = document.getElementById("input-rating-type").value;
    update_ratings_with(input_rating_value, input_rating_type);
}

function update_ratings_with(input_rating_value, input_rating_type) {
    const ratings_outputs = document.getElementsByClassName("rating-result");

    const normalized_rating = rating_to_normalized_rating(input_rating_value, input_rating_type);

    for (let output of ratings_outputs) {
        const output_type = output.id;
        let rating = rating_from_normalized_rating(normalized_rating, output_type);
        output.textContent = rating;
    }
}

function rating_to_normalized_rating(input_rating_value, input_rating_type) {
    if (input_rating_value === "") return "";
    if (input_rating_type === "") return "";

    const conversion = ratings_conversions.get(input_rating_type);
    const result = (input_rating_value - conversion[1]) / conversion[0];

    return result;
}

function rating_from_normalized_rating(input_rating_value, output_rating_type) {
    if (input_rating_value === "") return "";
    if (output_rating_type === "") return "";

    const conversion = ratings_conversions.get(output_rating_type);
    const result = conversion[0] * input_rating_value + conversion[1];

    return Math.round(result/10)*10; // Rounded to nearest 10s.
}
