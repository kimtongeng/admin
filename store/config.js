export const state = () => ({
    editor_option: {
        theme: 'snow',
        placeholder: '',
        modules: {
            toolbar: [
                [
                    'bold',
                    'underline',
                    'italic',
                    'strike',
                    'blockquote',
                    'image',
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { script: 'sub' },
                    { script: 'super' },
                    { indent: '-1' },
                    { indent: '+1' },
                    { direction: 'rtl' },
                    // { 'size': ['small', false, 'large', 'huge'] },
                    { header: [1, 2, 3, 4, 5, 6, false] },
                    { color: [] },
                    { background: [] },
                    { font: [] },
                    { align: [] },
                    'clean',
                    'link',
                    'video',
                ],
            ],
        },
    },
})

// getters
export const getters = {
    editorOption: (state) => state.editor_option,
}

// mutations
export const mutations = {
    
}

// action
export const actions = {
    
}
