//自定义指令
import { useUserStore } from "@/store/auth"

export default {
  beforeMount(el:any, binding:any) {
    const userStore = useUserStore()
    const { roles } = userStore
    const requirePermission = binding.value
    if(!roles.include(requirePermission)){
      el.style.display = "none"
    }
  },
}