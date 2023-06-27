import { defineComponent } from 'vue'
import styles from './styles.module.less'
export default defineComponent({
  props: [],
  components: {},
  setup(props) {
    return () => <div class={styles.main}>hello docker</div>
  },
})
