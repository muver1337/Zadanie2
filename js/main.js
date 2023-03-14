let eventBus = new Vue()

Vue.component('create', {
    template: `
    <section>
        <form class="create" @submit.prevent="onSubmit">
            <p>
                <input id="title" required v-model="title" type="text" placeholder="Заголовок">
            </p>
            <input required id="subtask1" v-model="subtask1" placeholder="Задача 1">
            <input required id="subtask2" v-model="subtask2" maxlength="30" placeholder="Задача 2">
            <input required id="subtask3" v-model="subtask3" maxlength="30" placeholder="Задача 3">
            <input  id="subtask4" v-model="subtask4" maxlength="30" placeholder="Задача 4">
            <input  id="subtask5" v-model="subtask5" maxlength="30" placeholder="Задача 5">
            <button type="submit">Добавить</button>
        </form>
    </section>
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
        name: 'Записи'
    }
})