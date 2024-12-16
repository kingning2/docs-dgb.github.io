---
outline: deep
---

# UView 补丁

## 功能

`uview-plus@3.3.36.patch`

- 修复 UView 的 `uni-app` 兼容问题
- 为 UView 中日历组件添加点击日历事件

## 具体代码

::: warning
- uview版本锁定在3.3.36，如果需要更新版本，请手动更新。
- 请在项目根目录下执行 `pnpm install` 安装补丁。
```json
// package.json
"pnpm": {
  "patchedDependencies": {
    "uview-plus@3.3.36": "patches/uview-plus@3.3.36.patch"
  }
}
```
:::

::: details 源代码

```patch
diff --git a/components/u-calendar/calendar.js b/components/u-calendar/calendar.js
index 154ddc61ebcfcfc3f411e424370277f5b3fdde32..fdec40e504a6a242f5113a6b2012358904b89591 100644
--- a/components/u-calendar/calendar.js
+++ b/components/u-calendar/calendar.js
@@ -37,6 +37,7 @@ export default {
         showRangePrompt: true,
         allowSameDay: false,
 		round: 0,
-		monthNum: 3
+		monthNum: 3,
+        minRange: 0, // 0
     }
 }
diff --git a/components/u-calendar/month.vue b/components/u-calendar/month.vue
index 76c81c59404aba6a5a3c99134fcf62d533c37f7e..005fceb1ca0b360a95ffd52463bed654d79d5840 100644
--- a/components/u-calendar/month.vue
+++ b/components/u-calendar/month.vue
@@ -112,6 +112,11 @@
 				type: [Number, String],
 				default: Infinity
 			},
+			// 日期区间最少可选天数，默认无限制，mode = range时有效
+			minRange: {
+				type: [Number, String],
+				default: 0
+			},
 			// 范围选择超过最多可选天数时的提示文案，mode = range时有效
 			rangePrompt: {
 				type: String,
@@ -397,6 +402,14 @@
 								}
 								return
 							}
+							if(dayjs(dayjs(date).subtract(this.minRange, 'day')).isBefore(dayjs(selected[0])) && this.showRangePrompt) {
+								if(this.rangePrompt) {
+									toast(this.rangePrompt)
+								} else {
+									toast(`选择天数不能低于 ${this.minRange} 天`)
+								}
+								return
+							}
 							// 如果当前日期大于已有日期，将当前的添加到数组尾部
 							selected.push(date)
 							const startDate = selected[0]
@@ -450,6 +463,11 @@
 				})
 				this.setSelected(defaultDate, false)
 			},
+			// 重置
+			reset() {
+				this.setSelected([])
+			},
+
 			setSelected(selected, event = true) {
 				this.selected = selected
 				event && this.$emit('monthSelected', this.selected,'tap')
diff --git a/components/u-calendar/props.js b/components/u-calendar/props.js
index df990fd661bbaf1320e00c46a27c50ef207907ef..526f30db7c133783e646c9fdec98fac5f967c7f4 100644
--- a/components/u-calendar/props.js
+++ b/components/u-calendar/props.js
@@ -118,6 +118,11 @@ export const props = defineMixin({
             type: [Number, String],
             default: () => defProps.calendar.maxRange
         },
+        // 日期区间最多可选天数，默认无限制，mode = range时有效
+        minRange: {
+            type: [Number, String],
+            default: () => defProps.calendar.minRange
+        },
         // 范围选择超过最多可选天数时的提示文案，mode = range时有效
         rangePrompt: {
             type: String,
diff --git a/components/u-calendar/u-calendar.vue b/components/u-calendar/u-calendar.vue
index c8f77ff6df6f323016ca565da3ce176d2512eb85..5987472cd8e3df1b20482f092a68c2456b823a61 100644
--- a/components/u-calendar/u-calendar.vue
+++ b/components/u-calendar/u-calendar.vue
@@ -1,66 +1,65 @@
 <template>
-	<u-popup
-		:show="show"
-		mode="bottom"
-		closeable
-		@close="close"
-		:round="round"
-		:closeOnClickOverlay="closeOnClickOverlay"
-	>
-		<view class="u-calendar">
-			<uHeader
-				:title="title"
-				:subtitle="subtitle"
-				:showSubtitle="showSubtitle"
-				:showTitle="showTitle"
-			></uHeader>
-			<scroll-view
-				:style="{
-                    height: addUnit(listHeight)
-                }"
-				scroll-y
-				@scroll="onScroll"
-				:scroll-top="scrollTop"
-				:scrollIntoView="scrollIntoView"
-			>
-				<uMonth
-					:color="color"
-					:rowHeight="rowHeight"
-					:showMark="showMark"
-					:months="months"
-					:mode="mode"
-					:maxCount="maxCount"
-					:startText="startText"
-					:endText="endText"
-					:defaultDate="defaultDate"
-					:minDate="innerMinDate"
-					:maxDate="innerMaxDate"
-					:maxMonth="monthNum"
-					:readonly="readonly"
-					:maxRange="maxRange"
-					:rangePrompt="rangePrompt"
-					:showRangePrompt="showRangePrompt"
-					:allowSameDay="allowSameDay"
-					ref="month"
-					@monthSelected="monthSelected"
-					@updateMonthTop="updateMonthTop"
-				></uMonth>
-			</scroll-view>
-			<slot name="footer" v-if="showConfirm">
-				<view class="u-calendar__confirm">
-					<u-button
-						shape="circle"
-						:text="
-                            buttonDisabled ? confirmDisabledText : confirmText
-                        "
-						:color="color"
-						@click="confirm"
-						:disabled="buttonDisabled"
-					></u-button>
-				</view>
-			</slot>
-		</view>
-	</u-popup>
+  <u-popup
+    :show="show"
+    mode="bottom"
+    closeable
+    @close="close"
+    :round="round"
+    :closeOnClickOverlay="closeOnClickOverlay"
+  >
+    <view class="u-calendar">
+      <uHeader
+        :title="title"
+        :subtitle="subtitle"
+        :showSubtitle="showSubtitle"
+        :showTitle="showTitle"
+      ></uHeader>
+      <scroll-view
+        :style="{
+          height: addUnit(listHeight),
+        }"
+        scroll-y
+        @scroll="onScroll"
+        :scroll-top="scrollTop"
+        :scrollIntoView="scrollIntoView"
+      >
+        <uMonth
+          :color="color"
+          :rowHeight="rowHeight"
+          :showMark="showMark"
+          :months="months"
+          :mode="mode"
+          :maxCount="maxCount"
+          :startText="startText"
+          :endText="endText"
+          :defaultDate="defaultDate"
+          :minDate="innerMinDate"
+          :maxDate="innerMaxDate"
+          :maxMonth="monthNum"
+          :readonly="readonly"
+          :maxRange="maxRange"
+          :minRange="minRange"
+          :rangePrompt="rangePrompt"
+          :showRangePrompt="showRangePrompt"
+          :allowSameDay="allowSameDay"
+          ref="month"
+          @monthSelected="monthSelected"
+          @updateMonthTop="updateMonthTop"
+        ></uMonth>
+      </scroll-view>
+      <slot name="footer" v-if="showConfirm">
+        <view class="u-calendar__confirm">
+          <u-button
+            shape="circle"
+            :text="buttonDisabled ? confirmDisabledText : confirmText"
+            :color="color"
+            @click="confirm"
+            :disabled="buttonDisabled"
+          ></u-button>
+        </view>
+      </slot>
+    </view>
+  </u-popup>
 </template>
 
 <script>
@@ -72,8 +71,8 @@ import dayjs from 'dayjs/esm/index'
 import Calendar from '../../libs/util/calendar.js'
 import { mpMixin } from '../../libs/mixin/mpMixin.js'
 import { mixin } from '../../libs/mixin/mixin.js'
-import { addUnit, range, error, padZero } from '../../libs/function/index';
-import test from '../../libs/function/test';
+import { addUnit, range, error, padZero } from '../../libs/function/index'
+import test from '../../libs/function/test'
 /**
  * Calendar 日历
  * @description  此组件用于单个选择日期，范围选择日期等，日历被包裹在底部弹起的容器中.
@@ -101,6 +100,7 @@ import test from '../../libs/function/test';
  * @property {Boolean}				closeOnClickOverlay	是否允许点击遮罩关闭日历 (默认 false )
  * @property {Boolean}				readonly	        是否为只读状态，只读状态下禁止选择日期 (默认 false )
  * @property {String | Number}		maxRange	        日期区间最多可选天数，默认无限制，mode = range时有效
+ * @property {String | Number}		minRange	        日期区间最少可选天数，默认无限制，mode = range时有效
  * @property {String}				rangePrompt	        范围选择超过最多可选天数时的提示文案，mode = range时有效
  * @property {Boolean}				showRangePrompt	    范围选择超过最多可选天数时，是否展示提示文案，mode = range时有效 (默认 true )
  * @property {Boolean}				allowSameDay	    是否允许日期范围的起止时间为同一天，mode = range时有效 (默认 false )
@@ -113,288 +113,272 @@ import test from '../../libs/function/test';
 	</u-calendar>
  * */
 export default {
-	name: 'u-calendar',
-	mixins: [mpMixin, mixin, props],
-	components: {
-		uHeader,
-		uMonth
-	},
-	data() {
-		return {
-			// 需要显示的月份的数组
-			months: [],
-			// 在月份滚动区域中，当前视图中月份的index索引
-			monthIndex: 0,
-			// 月份滚动区域的高度
-			listHeight: 0,
-			// month组件中选择的日期数组
-			selected: [],
-			scrollIntoView: '',
-			scrollIntoViewScroll: '',
-			scrollTop:0,
-			// 过滤处理方法
-			innerFormatter: (value) => value
-		}
-	},
-	watch: {
-		scrollIntoView: {
-			immediate: true,
-			handler(n) {
-				// console.log('scrollIntoView', n)
-			}
-		},
-		selectedChange: {
-			immediate: true,
-			handler(n) {
-				this.setMonth()
-			}
-		},
-		// 打开弹窗时，设置月份数据
-		show: {
-			immediate: true,
-			handler(n) {
-				if (n) {
-					this.setMonth()
-				} else {
-					// 关闭时重置scrollIntoView，否则会出现二次打开日历，当前月份数据显示不正确。
-					// scrollIntoView需要有一个值变动过程，才会产生作用。
-					this.scrollIntoView = ''
-				}
-			}
-		}
-	},
-	computed: {
-		// 由于maxDate和minDate可以为字符串(2021-10-10)，或者数值(时间戳)，但是dayjs如果接受字符串形式的时间戳会有问题，这里进行处理
-		innerMaxDate() {
-			return test.number(this.maxDate)
-				? Number(this.maxDate)
-				: this.maxDate
-		},
-		innerMinDate() {
-			return test.number(this.minDate)
-				? Number(this.minDate)
-				: this.minDate
-		},
-		// 多个条件的变化，会引起选中日期的变化，这里统一管理监听
-		selectedChange() {
-			return [this.innerMinDate, this.innerMaxDate, this.defaultDate]
-		},
-		subtitle() {
-			// 初始化时，this.months为空数组，所以需要特别判断处理
-			if (this.months.length) {
-				return `${this.months[this.monthIndex].year}年${
-					this.months[this.monthIndex].month
-				}月`
-			} else {
-				return ''
-			}
-		},
-		buttonDisabled() {
-			// 如果为range类型，且选择的日期个数不足1个时，让底部的按钮出于disabled状态
-			if (this.mode === 'range') {
-				if (this.selected.length <= 1) {
-					return true
-				} else {
-					return false
-				}
-			} else {
-				return false
-			}
-		}
-	},
-	mounted() {
-		this.start = Date.now()
-		this.init()
-	},
-	emits: ["confirm", "close"],
-	methods: {
-		addUnit,
-		// 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
-		setFormatter(e) {
-			this.innerFormatter = e
-		},
-		// month组件内部选择日期后，通过事件通知给父组件
-		monthSelected(e,scene ='init') {
-			this.selected = e
-			if (!this.showConfirm) {
-				// 在不需要确认按钮的情况下，如果为单选，或者范围多选且已选长度大于2，则直接进行返还
-				if (
-					this.mode === 'multiple' ||
-					this.mode === 'single' ||
-					(this.mode === 'range' && this.selected.length >= 2)
-				) {
-				   if( scene === 'init'){
-					 return
-				   }
-				   if( scene === 'tap') {
-					 this.$emit('confirm', this.selected)
-				   }
-				}
-			}
-		},
-		init() {
-			// 校验maxDate，不能小于minDate。
-			if (
-				this.innerMaxDate &&
-                this.innerMinDate &&
-				new Date(this.innerMaxDate).getTime() < new Date(this.innerMinDate).getTime()
-			) {
-				return error('maxDate不能小于minDate时间')
-			}
-			// 滚动区域的高度
-			this.listHeight = this.rowHeight * 5 + 30
-			this.setMonth()
-		},
-		close() {
-			this.$emit('close')
-		},
-		// 点击确定按钮
-		confirm() {
-			if (!this.buttonDisabled) {
-				this.$emit('confirm', this.selected)
-			}
-		},
-		// 获得两个日期之间的月份数
-		getMonths(minDate, maxDate) {
-			const minYear = dayjs(minDate).year()
-			const minMonth = dayjs(minDate).month() + 1
-			const maxYear = dayjs(maxDate).year()
-			const maxMonth = dayjs(maxDate).month() + 1
-			return (maxYear - minYear) * 12 + (maxMonth - minMonth) + 1
-		},
-		// 设置月份数据
-		setMonth() {
-			// 最小日期的毫秒数
-			const minDate = this.innerMinDate || dayjs().valueOf()
-			// 如果没有指定最大日期，则往后推3个月
-			const maxDate =
-				this.innerMaxDate ||
-				dayjs(minDate)
-					.add(this.monthNum - 1, 'month')
-					.valueOf()
-			// 最大最小月份之间的共有多少个月份，
-			const months = range(
-				1,
-				this.monthNum,
-				this.getMonths(minDate, maxDate)
-			)
-			// 先清空数组
-			this.months = []
-			for (let i = 0; i < months; i++) {
-				this.months.push({
-					date: new Array(
-						dayjs(minDate).add(i, 'month').daysInMonth()
-					)
-						.fill(1)
-						.map((item, index) => {
-							// 日期，取值1-31
-							let day = index + 1
-							// 星期，0-6，0为周日
-							const week = dayjs(minDate)
-								.add(i, 'month')
-								.date(day)
-								.day()
-							const date = dayjs(minDate)
-								.add(i, 'month')
-								.date(day)
-								.format('YYYY-MM-DD')
-							let bottomInfo = ''
-							if (this.showLunar) {
-								// 将日期转为农历格式
-								const lunar = Calendar.solar2lunar(
-									dayjs(date).year(),
-									dayjs(date).month() + 1,
-									dayjs(date).date()
-								)
-								bottomInfo = lunar.IDayCn
-							}
-							let config = {
-								day,
-								week,
-								// 小于最小允许的日期，或者大于最大的日期，则设置为disabled状态
-								disabled:
-									dayjs(date).isBefore(
-										dayjs(minDate).format('YYYY-MM-DD')
-									) ||
-									dayjs(date).isAfter(
-										dayjs(maxDate).format('YYYY-MM-DD')
-									),
-								// 返回一个日期对象，供外部的formatter获取当前日期的年月日等信息，进行加工处理
-								date: new Date(date),
-								bottomInfo,
-								dot: false,
-								month:
-									dayjs(minDate).add(i, 'month').month() + 1
-							}
-							const formatter =
-								this.formatter || this.innerFormatter
-							return formatter(config)
-						}),
-					// 当前所属的月份
-					month: dayjs(minDate).add(i, 'month').month() + 1,
-					// 当前年份
-					year: dayjs(minDate).add(i, 'month').year()
-				})
-			}
-		},
-		// 滚动到默认设置的月份
-		scrollIntoDefaultMonth(selected) {
-			// 查询默认日期在可选列表的下标
-			const _index = this.months.findIndex(({
-				  year,
-				  month
-			  }) => {
-				month = padZero(month)
-				return `${year}-${month}` === selected
-			})
-			if (_index !== -1) {
-				// #ifndef MP-WEIXIN
-				this.$nextTick(() => {
-					this.scrollIntoView = `month-${_index}`
-					this.scrollIntoViewScroll = this.scrollIntoView
-				})
-				// #endif
-				// #ifdef MP-WEIXIN
-				this.scrollTop = this.months[_index].top || 0;
-				// #endif
-			}
-		},
-		// scroll-view滚动监听
-		onScroll(event) {
-			// 不允许小于0的滚动值，如果scroll-view到顶了，继续下拉，会出现负数值
-			const scrollTop = Math.max(0, event.detail.scrollTop)
-			// 将当前滚动条数值，除以滚动区域的高度，可以得出当前滚动到了哪一个月份的索引
-			for (let i = 0; i < this.months.length; i++) {
-				if (scrollTop >= (this.months[i].top || this.listHeight)) {
-					this.monthIndex = i
-					this.scrollIntoViewScroll = `month-${i}`
-				}
-			}
-		},
-		// 更新月份的top值
-		updateMonthTop(topArr = []) {
-			// 设置对应月份的top值，用于onScroll方法更新月份
-			topArr.map((item, index) => {
-				this.months[index].top = item
-			})
+  name: 'u-calendar',
+  mixins: [mpMixin, mixin, props],
+  components: {
+    uHeader,
+    uMonth,
+  },
+  data() {
+    return {
+      // 需要显示的月份的数组
+      months: [],
+      // 在月份滚动区域中，当前视图中月份的index索引
+      monthIndex: 0,
+      // 月份滚动区域的高度
+      listHeight: 0,
+      // month组件中选择的日期数组
+      selected: [],
+      scrollIntoView: '',
+      scrollIntoViewScroll: '',
+      scrollTop: 0,
+      // 过滤处理方法
+      innerFormatter: (value) => value,
+    }
+  },
+  watch: {
+    scrollIntoView: {
+      immediate: true,
+      handler(n) {
+        // console.log('scrollIntoView', n)
+      },
+    },
+    selectedChange: {
+      immediate: true,
+      handler(n) {
+        this.setMonth()
+      },
+    },
+    // 打开弹窗时，设置月份数据
+    show: {
+      immediate: true,
+      handler(n) {
+        if (n) {
+          this.setMonth()
+        } else {
+          // 关闭时重置scrollIntoView，否则会出现二次打开日历，当前月份数据显示不正确。
+          // scrollIntoView需要有一个值变动过程，才会产生作用。
+          this.scrollIntoView = ''
+        }
+      },
+    },
+  },
+  computed: {
+    // 由于maxDate和minDate可以为字符串(2021-10-10)，或者数值(时间戳)，但是dayjs如果接受字符串形式的时间戳会有问题，这里进行处理
+    innerMaxDate() {
+      return test.number(this.maxDate) ? Number(this.maxDate) : this.maxDate
+    },
+    innerMinDate() {
+      return test.number(this.minDate) ? Number(this.minDate) : this.minDate
+    },
+    // 多个条件的变化，会引起选中日期的变化，这里统一管理监听
+    selectedChange() {
+      return [this.innerMinDate, this.innerMaxDate, this.defaultDate]
+    },
+    subtitle() {
+      // 初始化时，this.months为空数组，所以需要特别判断处理
+      if (this.months.length) {
+        return `${this.months[this.monthIndex].year}年${
+          this.months[this.monthIndex].month
+        }月`
+      } else {
+        return ''
+      }
+    },
+    buttonDisabled() {
+      // 如果为range类型，且选择的日期个数不足1个时，让底部的按钮出于disabled状态
+      if (this.mode === 'range') {
+        if (this.selected.length <= 1) {
+          return true
+        } else {
+          return false
+        }
+      } else {
+        return false
+      }
+    },
+  },
+  mounted() {
+    this.start = Date.now()
+    this.init()
+  },
+  emits: ['confirm', 'close', 'onSelectClick'],
+  methods: {
+    addUnit,
+    // 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
+    setFormatter(e) {
+      this.innerFormatter = e
+    },
+    // month组件内部选择日期后，通过事件通知给父组件
+    monthSelected(e, scene = 'init') {
+      this.selected = e
+      this.$emit('onSelectClick', e)
+      if (!this.showConfirm) {
+        // 在不需要确认按钮的情况下，如果为单选，或者范围多选且已选长度大于2，则直接进行返还
+        if (
+          this.mode === 'multiple' ||
+          this.mode === 'single' ||
+          (this.mode === 'range' && this.selected.length >= 2)
+        ) {
+          if (scene === 'init') {
+            return
+          }
+          if (scene === 'tap') {
+            this.$emit('confirm', this.selected)
+          }
+        }
+      }
+    },
+    // 重置日期
+    reset() {
+      this.$refs.month.reset()
+    },
+    init() {
+      // 校验maxDate，不能小于minDate。
+      if (
+        this.innerMaxDate &&
+        this.innerMinDate &&
+        new Date(this.innerMaxDate).getTime() <
+          new Date(this.innerMinDate).getTime()
+      ) {
+        return error('maxDate不能小于minDate时间')
+      }
+      // 滚动区域的高度
+      this.listHeight = this.rowHeight * 5 + 30
+      this.setMonth()
+    },
+    close() {
+      this.$emit('close')
+    },
+    // 点击确定按钮
+    confirm() {
+      if (!this.buttonDisabled) {
+        this.$emit('confirm', this.selected)
+      }
+    },
+    // 获得两个日期之间的月份数
+    getMonths(minDate, maxDate) {
+      const minYear = dayjs(minDate).year()
+      const minMonth = dayjs(minDate).month() + 1
+      const maxYear = dayjs(maxDate).year()
+      const maxMonth = dayjs(maxDate).month() + 1
+      return (maxYear - minYear) * 12 + (maxMonth - minMonth) + 1
+    },
+    // 设置月份数据
+    setMonth() {
+      // 最小日期的毫秒数
+      const minDate = this.innerMinDate || dayjs().valueOf()
+      // 如果没有指定最大日期，则往后推3个月
+      const maxDate =
+        this.innerMaxDate ||
+        dayjs(minDate)
+          .add(this.monthNum - 1, 'month')
+          .valueOf()
+      // 最大最小月份之间的共有多少个月份，
+      const months = range(1, this.monthNum, this.getMonths(minDate, maxDate))
+      // 先清空数组
+      this.months = []
+      for (let i = 0; i < months; i++) {
+        this.months.push({
+          date: new Array(dayjs(minDate).add(i, 'month').daysInMonth())
+            .fill(1)
+            .map((item, index) => {
+              // 日期，取值1-31
+              let day = index + 1
+              // 星期，0-6，0为周日
+              const week = dayjs(minDate).add(i, 'month').date(day).day()
+              const date = dayjs(minDate)
+                .add(i, 'month')
+                .date(day)
+                .format('YYYY-MM-DD')
+              let bottomInfo = ''
+              if (this.showLunar) {
+                // 将日期转为农历格式
+                const lunar = Calendar.solar2lunar(
+                  dayjs(date).year(),
+                  dayjs(date).month() + 1,
+                  dayjs(date).date()
+                )
+                bottomInfo = lunar.IDayCn
+              }
+              let config = {
+                day,
+                week,
+                // 小于最小允许的日期，或者大于最大的日期，则设置为disabled状态
+                disabled:
+                  dayjs(date).isBefore(dayjs(minDate).format('YYYY-MM-DD')) ||
+                  dayjs(date).isAfter(dayjs(maxDate).format('YYYY-MM-DD')),
+                // 返回一个日期对象，供外部的formatter获取当前日期的年月日等信息，进行加工处理
+                date: new Date(date),
+                bottomInfo,
+                dot: false,
+                month: dayjs(minDate).add(i, 'month').month() + 1,
+              }
+              const formatter = this.formatter || this.innerFormatter
+              return formatter(config)
+            }),
+          // 当前所属的月份
+          month: dayjs(minDate).add(i, 'month').month() + 1,
+          // 当前年份
+          year: dayjs(minDate).add(i, 'month').year(),
+        })
+      }
+    },
+    // 滚动到默认设置的月份
+    scrollIntoDefaultMonth(selected) {
+      // 查询默认日期在可选列表的下标
+      const _index = this.months.findIndex(({ year, month }) => {
+        month = padZero(month)
+        return `${year}-${month}` === selected
+      })
+      if (_index !== -1) {
+        // #ifndef MP-WEIXIN
+        this.$nextTick(() => {
+          this.scrollIntoView = `month-${_index}`
+          this.scrollIntoViewScroll = this.scrollIntoView
+        })
+        // #endif
+        // #ifdef MP-WEIXIN
+        this.scrollTop = this.months[_index].top || 0
+        // #endif
+      }
+    },
+    // scroll-view滚动监听
+    onScroll(event) {
+      // 不允许小于0的滚动值，如果scroll-view到顶了，继续下拉，会出现负数值
+      const scrollTop = Math.max(0, event.detail.scrollTop)
+      // 将当前滚动条数值，除以滚动区域的高度，可以得出当前滚动到了哪一个月份的索引
+      for (let i = 0; i < this.months.length; i++) {
+        if (scrollTop >= (this.months[i].top || this.listHeight)) {
+          this.monthIndex = i
+          this.scrollIntoViewScroll = `month-${i}`
+        }
+      }
+    },
+    // 更新月份的top值
+    updateMonthTop(topArr = []) {
+      // 设置对应月份的top值，用于onScroll方法更新月份
+      topArr.map((item, index) => {
+        this.months[index].top = item
+      })
 
-			// 获取默认日期的下标
-			if (!this.defaultDate) {
-				// 如果没有设置默认日期，则将当天日期设置为默认选中的日期
-				const selected = dayjs().format("YYYY-MM")
-				this.scrollIntoDefaultMonth(selected)
-				return
-			}
-			let selected = dayjs().format("YYYY-MM");
-			// 单选模式，可以是字符串或数组，Date对象等
-			if (!test.array(this.defaultDate)) {
-				selected = dayjs(this.defaultDate).format("YYYY-MM")
-			} else {
-				selected = dayjs(this.defaultDate[0]).format("YYYY-MM");
-			}
-			this.scrollIntoDefaultMonth(selected)
-		}
-	}
+      // 获取默认日期的下标
+      if (!this.defaultDate) {
+        // 如果没有设置默认日期，则将当天日期设置为默认选中的日期
+        const selected = dayjs().format('YYYY-MM')
+        this.scrollIntoDefaultMonth(selected)
+        return
+      }
+      let selected = dayjs().format('YYYY-MM')
+      // 单选模式，可以是字符串或数组，Date对象等
+      if (!test.array(this.defaultDate)) {
+        selected = dayjs(this.defaultDate).format('YYYY-MM')
+      } else {
+        selected = dayjs(this.defaultDate[0]).format('YYYY-MM')
+      }
+      this.scrollIntoDefaultMonth(selected)
+    },
+  },
 }
 </script>
 
@@ -402,8 +386,8 @@ export default {
 @import '../../libs/css/components.scss';
 
 .u-calendar {
-	&__confirm {
-		padding: 7px 18px;
-	}
+  &__confirm {
+    padding: 7px 18px;
+  }
 }
 </style>

```
