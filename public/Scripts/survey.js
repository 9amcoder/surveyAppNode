let displayQuestionsField = () => {
    let questions = $("#number").val();
    let html = '';
    for(let i=0; i<questions; i++)
    {
        html += "<label for='question'>Question "+(i+1)+":</label><br>";
        html += "<textarea name='questions'></textarea><br>"
    }
    $("#questionsField").html(html);
}