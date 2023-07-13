//react
import type {AttributifyAttributes} from '@unocss/preset-attributify'
declare module "react"{
    interface HTMLAttributes<T> extends AttributifyAttributes {}//tsx标签写uno不报错
}
