const app = {
    data(){
        return{
            lista: [],
            inp:{desc:'',prio:''},
            disp:0,
            search:''
        }
    },
    methods:{
        crearTarea(){
            if (this.inp.desc!='' && this.inp.prio!=''){
                this.lista.push({desc:this.inp.desc,fecha:Date.now(),mincrea:0,prio:this.inp.prio,check:false})
                this.saveToStorage()
            }
        },
        ajustPrio(index,ajust){
            if (this.lista[index].prio=='Alta'){
                this.lista[index].prio = (ajust == -1)?'Media':'Alta'
            }else if(this.lista[index].prio=='Media'){
                this.lista[index].prio = (ajust == -1)?'Baja':'Alta'
            }else{
                this.lista[index].prio = (ajust == -1)?'Baja':'Media'
            }
        },
        saveToStorage(){
            localStorage.setItem("listaTareas",JSON.stringify(this.lista))
        },
        deleteTarea(index){
            this.lista.splice(index,1)
            this.saveToStorage()
        },
        toggleCheck(index){
            this.lista[index].check=(this.lista[index].check)?false:true
            this.saveToStorage()
        },
        toggleDiplay(val){
            this.disp = val
        },
        deleteCompleted(){
            this.lista = this.lista.filter(this.deleteFilter)
            this.saveToStorage()
        },
        sortKey(a,b){
            prioa = (a.prio == 'Alta')?3:(a.prio == 'Media')?2:1
            priob = (b.prio == 'Alta')?3:(b.prio == 'Media')?2:1
            return priob - prioa
        },
        displayFilter(val){
            if (this.disp == 2){
                return (val.check)?true:false
            }else if(this.disp == 1){
                return (val.check)?false:true
            }else{
                return true
            }
        },
        deleteFilter(val){
            return (val.check)?false:true
        },
        searchFilter(val){
            return val.desc.includes(this.search)
        },
        counterFunc(acu,el){
            return (el.check)?acu+1:acu
        },
    },
    mounted(){
        setInterval(()=>{
            for (e of this.lista){
                e.mincrea = Math.floor((Date.now() - e.fecha)/60000)
                this.saveToStorage()
            }
        },30000)
    },
    computed:{
        sortedList(){
            let resul = this.lista.sort(this.sortKey).filter(this.displayFilter)
            return (this.search != '')?resul.filter(this.searchFilter):resul
        },
        totalTask(){
            return this.lista.length
        },
        totalDone(){
            return this.lista.reduce(this.counterFunc,0)
        }
    },
    created(){
        if (localStorage.listaTareas){
            this.lista = JSON.parse(localStorage.listaTareas)
        }
    }
}
window.onload = ()=>{
Vue.createApp(app).mount('#app')
}