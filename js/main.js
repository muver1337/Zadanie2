let eventBus = new Vue()

Vue.component('cols', {
    template: `
    <div id="cols">
    <div class="col-wrapper">
    <h2 class="error" v-for="error in errors">{{error}}</h2>
        <create></create>
        <div class="cols-wrapper">
            <div class="col">
                <ul>
                    <li class="cards" style="background-color: #ee666f" v-for="card in column1"><p class="p-title">{{ card.title }}</p>
                        <ul>
                            <li class="tasks" v-for="t, index in card.subtasks" @click="clickToCard1(card, t, index)" v-if="t.title != null"> 
                                <p :class="{completed: t.completed}" >{{t.title}}</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="col">
                <ul>
                    <li class="cards" style="background-color: #f3ef54" v-for="card in column2"><p class="p-title">{{ card.title }}</p>
                        <ul>
                            <li class="tasks" v-for="t in card.subtasks" @click="newStatus2(card, t)" v-if="t.title != null"> 
                                <p :class="{completed: t.completed}">{{t.title}}</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="col">
                <ul>
                    <li class="cards" style="background-color: #56fa56" v-for="card in column3"><p class="p-title">{{ card.title }}</p><div class="flex-revers"><p>{{ card.date }}</p>
                        <ul>
                            <li class="tasks" v-for="t in card.subtasks" @click="TaskCompleted(card, task)"  v-if="t.title != null">
                                <p :class="{completed: t.completed}">{{t.title}}</p>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
</div>
        
`,
    data() {
        return {
            column1: [],
            isBlocked: false,
            bufferCard: null,
            column2: [],
            column3: [],
            errors: [],
        }
    },

    mounted() {
        this.column1 = JSON.parse(localStorage.getItem('column1')) || [];
        this.column2 = JSON.parse(localStorage.getItem('column2')) || [];
        this.column3 = JSON.parse(localStorage.getItem('column3')) || [];
        eventBus.$on('card-submitted', card => {
            this.errors = []
            if (this.column1.length < 3) {
                this.column1.push(card)
                this.saveColumn1();
            } else {
                this.errors.push("Нельзя добавить больше 3 записей.")
            }
        })
    },
    methods: {
        saveColumn1() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
        },
        saveColumn2() {
            localStorage.setItem('column2', JSON.stringify(this.column2));
        },
        saveColumn3() {
            localStorage.setItem('column3', JSON.stringify(this.column3));
        },
        newStatus1(card, t) {
            t.completed = true
            let count = 0
            card.status = 0
            this.errors = []
            for (let i = 0; i < 5; i++) {
                if (card.subtasks[i].title != null) {
                    count++
                }
            }

            for (let i = 0; i < count; i++) {
                if (card.subtasks[i].completed === true) {
                    card.status++
                }
            }

            if (this.amountPercentCard(card.status, card.subtasks) === 2 && this.column2.length < 5 && !this.isBlocked) {
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card), 1)
                this.saveColumn1();
                this.saveColumn2();
            } else if (this.column2.length === 5 && this.amountPercentCard(card.status, card.subtasks) === 2) {
                return 'block';
            }
        },
        newStatus2(card, t) {
            t.completed = true
            let count = 0
            card.status = 0
            for (let i = 0; i < 5; i++) {
                if (card.subtasks[i].title != null) {
                    count++
                }
            }

            for (let i = 0; i < count; i++) {
                if (card.subtasks[i].completed === true) {
                    card.status++
                }
            }

            if (card.status / count * 100 === 100) {
                this.column3.push(card)
                this.column2.splice(this.column2.indexOf(card), 1)
                card.date = new Date().toLocaleString()
                this.saveColumn2();
                this.saveColumn3();
            }
            if(this.isBlocked) {
                let bufferCard = this.column1.splice(this.bufferCard, 1);
                this.column2.push(bufferCard[0]);
                this.isBlocked = false;
                this.errors = [];
                this.saveColumn2();
                this.saveColumn1();
            }
        },

        clickToCard1(card, t, index) {
            if(!this.isBlocked) {
                let res = this.newStatus1(card, t);
                if(res) {
                    this.isBlocked = true;
                    this.errors.push('Второй столбец переполнен');
                    this.bufferCard = index;
                    console.log(this.bufferCard);
                    this.saveColumn1();
                }
                else this.isBlocked = false;
            }
        },

        amountPercentCard(completedAmount, tasks) {
            let amountTasks = tasks.filter(t => {return t.title});
            if(completedAmount / amountTasks.length >= 0.5) return 2;
            else if(completedAmount / amountTasks.length === 1) return 3;
            else if(completedAmount / amountTasks.length < 0.5) return 1;
        },
    },
    computed: {},
})

Vue.component('create', {
    template: `
        <form class="create" @submit.prevent="onSubmit">
            <p>
                <input id="title" required v-model="title" type="text" placeholder="Заголовок">
            </p>
            <input required id="subtask1" v-model="subtask1" placeholder="Задача 1">
            <input required id="subtask2" v-model="subtask2" maxlength="25" placeholder="Задача 2">
            <input required id="subtask3" v-model="subtask3" maxlength="25" placeholder="Задача 3">
            <input  id="subtask4" v-model="subtask4" maxlength="25" placeholder="Задача 4">
            <input  id="subtask5" v-model="subtask5" maxlength="25" placeholder="Задача 5">
            <button type="submit">Добавить задачу</button>
        </form>
    `,
    data() {
        return {
            title: null,
            subtask1: null,
            subtask2: null,
            subtask3: null,
            subtask4: null,
            subtask5: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                subtasks: [{title: this.subtask1, completed: false},
                    {title: this.subtask2, completed: false},
                    {title: this.subtask3, completed: false},
                    {title: this.subtask4, completed: false},
                    {title: this.subtask5, completed: false}],
                date: null,
                status: 0
            }
            eventBus.$emit('card-submitted', card)
            this.title = null
            this.subtask1 = null
            this.subtask2 = null
            this.subtask3 = null
            this.subtask4 = null
            this.subtask5 = null
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Добавление задачи'
    }
})