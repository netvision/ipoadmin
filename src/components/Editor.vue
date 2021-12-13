<template>
  <div>
      <q-editor 
      v-model="post.body" 
      :definitions="definitions" 
      ref="editor"
      :toolbar= "[
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['hr', 'link'],
        ['insert_img'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
        ['viewsource']
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }" />
      <q-btn color="primary" label="Save" @click="saveContent" />
  </div>
  <q-dialog v-model="imgDialog">
    <q-card class="my-card">
      <q-card-section>
        <q-uploader
        url="https://droplet.netserve.in/ipo/editimg"
        color="teal"
        field-name="image"
        flat
        bordered
        auto-upload
        style="max-width: 500px"
        @uploaded = 'getImgSrc'
      />
      <q-input v-model="width" label="Width in px" />
      <q-select v-model="float" :options="['left', 'right']" label="Align" />
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat @click="insert">Insert</q-btn>
        <q-btn flat @click="imgDialog = false">Cancel</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import 'babel-polyfill'; // es6 shim
export default defineComponent({
  name: 'Editor',
  props: ['htmlContent'],
  data() {
    return {
        definitions: {
                insert_img: {
                    tip: 'Insert Image',
                    icon: 'photo',
                    handler: this.insertImg // handler will call insertImg() method
                }
            },
        post: {
            body: this.htmlContent
            },
        imgDialog: false,
        float: 'left', 
        width: '',
        editImgSrc: ''
			}
    },
    methods: {
        insertImg() { 
          this.imgDialog = true
          /*
          // insertImg method
            const post = this.post
            const edit = this.$refs.editor
            
            // create an input file element to open file dialog
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.png, .jpg' // file extensions allowed
            let file
            input.onchange = _ => {
                const files = Array.from(input.files)
                file = files[0]
  
               // lets load the file as dataUrl
                const reader = new FileReader()
                let dataUrl = ''
                reader.onloadend = function() {
                    dataUrl = reader.result
                    edit.runCmd('insertHTML','<div><img style="float:left; max-width:300px" src="' + dataUrl + '" /></div>', true) 
                }
                reader.readAsDataURL(file)
            }
            input.click()
            */
            
        },

        insert(){
          const edit = this.$refs.editor
          const style = '{float:'+this.float+', padding:4px}'
          edit.runCmd('insertHTML','<div style="clear:both; padding:4px; margin:4px"><img src="'+this.editImgSrc+'" style="width:'+this.width+'; float:'+this.float+'" /></div>', true)
          this.imgDialog = false
        },

        getImgSrc(files){
          this.editImgSrc = JSON.parse(files.xhr.response)
        },

        saveContent(){
          this.$emit('update', this.post)
        }
    }
})
</script>