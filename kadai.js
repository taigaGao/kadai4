window.onload = function () {
    //各ブロックのIDの取得
    const startQuestionsBtn = document.getElementById('startQuestions');
    const resetQuestionsBtn = document.getElementById('resetQuestions');
    const startBlock = document.getElementById('startBlock');
    const waitBlock = document.getElementById('waitBlock');
    const quizBlock = document.getElementById('quizBlock');
    const quizNum = document.getElementById('quizNum');
    const quizGenre = document.getElementById('quizGenre'); 
    const quizDifficulty = document.getElementById('quizDifficulty');
    const quizDetail = document.getElementById('quizDetail');
    const quizContentDisplay = document.getElementById('quizContentDisplay');
    const resultBlock = document.getElementById('resultBlock');
    const resultNum = document.getElementById('resultNum');
    //現在の回答数の初期値を0で定義
    let answerCount = 0;
    //現在の正答数の初期値を0で定義
    let correctCount = 0;
    //クイズの内容を格納する空オブジェクトを作成
    let quizContentArray = {};
    const getQuestion = () => {
        fetch('https://opentdb.com/api.php?amount=10&type=multiple')
            .then((response) => {
                if (response.ok) { // ステータスがokの場合
                    return response.json(); // レスポンスをJSON形式で返す
                } else {
                    throw new Error();
                }
            })
            .then((text) => { //前回の処理の結果を受け取り、後続の処理を実行
                quizContentArray = text['results']; //受け取ったJSONからキーresultsをオブジェクトに格納
                for (let i = 0; i < quizContentArray.length; i++) {
                    //正答と誤答を混ぜた配列(all_answers)を作成する処理
                    let correct_answer = [];
                    correct_answer = [quizContentArray[i].correct_answer];
                    let all_answers = correct_answer.concat(quizContentArray[i].incorrect_answers);
                    //配列の中身をシャッフルする処理
                    for(var n = all_answers.length - 1; n > 0; n--){
                        var r = Math.floor(Math.random() * (n + 1));
                        var tmp = all_answers[n];
                        all_answers[n] = all_answers[r];
                        all_answers[r] = tmp;
                    }
                    //各クイズ情報のオブジェクトにall_answersを追加
                    quizContentArray[i].all_answers = all_answers;
                }
                //処理待ち中ブロックの非表示
                waitBlock.style.display = 'none';
                //クイズブロックの表示
                quizBlock.style.display = 'block';
                //クイズの実行処理を開始
                displayQuestion();
            })
            .catch((error) => console.log(error));
    };
    //クイズ内容ボタンの作成関数
    const addQuestionBtn = (quizAnwsertNum) => {
        const createBtn = document.createElement('button');
        quizContentDisplay.appendChild(createBtn).textContent = quizContentArray[answerCount].all_answers[quizAnwsertNum];
        return createBtn;
    };
    //作成したクイズ内容ボタンに回答時(クリック時)のイベントを付与する処理
    const addAnswerEvent = (createBtn) => {
        createBtn.addEventListener('click', function() {
            const answer = this.textContent;
            checkAnswer(answer);
            //現在の回答数に1追加
            answerCount++;
            //クイズ内容ブロックの表示初期化
            quizContentDisplay.innerHTML = '';
            //クイズの実行処理を開始
            displayQuestion();
        });
    };
    //回答の確認処理
    const checkAnswer = (answer) => { //クリックされたクイズボタン内のテキストを引数として受け取る
        //クリックされたボタンのテキストと、クイズオブジェクトが持つ正答(correct_answer)が等しい場合処理を実行
        if (answer === quizContentArray[answerCount].correct_answer) {
            //正答のカウントに1追加
            correctCount++;
        };
    };
    //クイズの表示処理
    const displayQuestion = () => {
        //回答数がmaxの10の場合、クイズの表示処理を中断し、結果確認ブロックを表示する
        if (answerCount === 10) {
            quizBlock.style.display = 'none';
            resultBlock.style.display = 'block';
            //正答数としてcorrectCountを出力する
            resultNum.innerHTML = correctCount;
            return;
        };
        //現在の問題数としてanswerCountを出力する
        quizNum.innerHTML = answerCount + 1;
        quizGenre.innerHTML = quizContentArray[answerCount].category;
        quizDifficulty.innerHTML = quizContentArray[answerCount].difficulty;
        quizDetail.innerHTML = quizContentArray[answerCount].question;
        for (let i = 0; i < 4; i++) {
            const createBtn = addQuestionBtn(i);
            addAnswerEvent(createBtn);
        };
    }
    //開始ボタンを押したときの処理
    startQuestionsBtn.addEventListener('click',function () {
        startBlock.style.display = 'none';
        waitBlock.style.display = 'block';
        getQuestion();
    });
    //ホームに戻るボタンを押したときの処理
    resetQuestionsBtn.addEventListener('click',function () {
        //各変数・オブジェクトの初期化
        answerCount = 0;
        correctCount = 0;
        quizContentArray = {};
        resultBlock.style.display = 'none';
        startBlock.style.display = 'block';
    });
}
