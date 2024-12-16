import{_ as s,c as a,aP as p,o as t}from"./chunks/framework.Bh_p5CYG.js";const u=JSON.parse('{"title":"UView 补丁","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"patch/uview.md","filePath":"patch/uview.md","lastUpdated":1734319953000}'),l={name:"patch/uview.md"};function e(i,n,c,o,r,m){return t(),a("div",null,n[0]||(n[0]=[p(`<h1 id="uview-补丁" tabindex="-1">UView 补丁 <a class="header-anchor" href="#uview-补丁" aria-label="Permalink to &quot;UView 补丁&quot;">​</a></h1><h2 id="功能" tabindex="-1">功能 <a class="header-anchor" href="#功能" aria-label="Permalink to &quot;功能&quot;">​</a></h2><p><code>uview-plus@3.3.36.patch</code></p><ul><li>修复 UView 的 <code>uni-app</code> 兼容问题</li><li>为 UView 中日历组件添加点击日历事件</li></ul><h2 id="具体代码" tabindex="-1">具体代码 <a class="header-anchor" href="#具体代码" aria-label="Permalink to &quot;具体代码&quot;">​</a></h2><div class="warning custom-block"><p class="custom-block-title">WARNING</p><ul><li>uview版本锁定在3.3.36，如果需要更新版本，请手动更新。</li><li>请在项目根目录下执行 <code>pnpm install</code> 安装补丁。</li></ul><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// package.json</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;pnpm&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;patchedDependencies&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;uview-plus@3.3.36&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;patches/uview-plus@3.3.36.patch&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></div><details class="details custom-block"><summary>源代码</summary><div class="language-patch vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">patch</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>diff --git a/components/u-calendar/calendar.js b/components/u-calendar/calendar.js</span></span>
<span class="line"><span>index 154ddc61ebcfcfc3f411e424370277f5b3fdde32..fdec40e504a6a242f5113a6b2012358904b89591 100644</span></span>
<span class="line"><span>--- a/components/u-calendar/calendar.js</span></span>
<span class="line"><span>+++ b/components/u-calendar/calendar.js</span></span>
<span class="line"><span>@@ -37,6 +37,7 @@ export default {</span></span>
<span class="line"><span>         showRangePrompt: true,</span></span>
<span class="line"><span>         allowSameDay: false,</span></span>
<span class="line"><span> 		round: 0,</span></span>
<span class="line"><span>-		monthNum: 3</span></span>
<span class="line"><span>+		monthNum: 3,</span></span>
<span class="line"><span>+        minRange: 0, // 0</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>diff --git a/components/u-calendar/month.vue b/components/u-calendar/month.vue</span></span>
<span class="line"><span>index 76c81c59404aba6a5a3c99134fcf62d533c37f7e..005fceb1ca0b360a95ffd52463bed654d79d5840 100644</span></span>
<span class="line"><span>--- a/components/u-calendar/month.vue</span></span>
<span class="line"><span>+++ b/components/u-calendar/month.vue</span></span>
<span class="line"><span>@@ -112,6 +112,11 @@</span></span>
<span class="line"><span> 				type: [Number, String],</span></span>
<span class="line"><span> 				default: Infinity</span></span>
<span class="line"><span> 			},</span></span>
<span class="line"><span>+			// 日期区间最少可选天数，默认无限制，mode = range时有效</span></span>
<span class="line"><span>+			minRange: {</span></span>
<span class="line"><span>+				type: [Number, String],</span></span>
<span class="line"><span>+				default: 0</span></span>
<span class="line"><span>+			},</span></span>
<span class="line"><span> 			// 范围选择超过最多可选天数时的提示文案，mode = range时有效</span></span>
<span class="line"><span> 			rangePrompt: {</span></span>
<span class="line"><span> 				type: String,</span></span>
<span class="line"><span>@@ -397,6 +402,14 @@</span></span>
<span class="line"><span> 								}</span></span>
<span class="line"><span> 								return</span></span>
<span class="line"><span> 							}</span></span>
<span class="line"><span>+							if(dayjs(dayjs(date).subtract(this.minRange, &#39;day&#39;)).isBefore(dayjs(selected[0])) &amp;&amp; this.showRangePrompt) {</span></span>
<span class="line"><span>+								if(this.rangePrompt) {</span></span>
<span class="line"><span>+									toast(this.rangePrompt)</span></span>
<span class="line"><span>+								} else {</span></span>
<span class="line"><span>+									toast(\`选择天数不能低于 \${this.minRange} 天\`)</span></span>
<span class="line"><span>+								}</span></span>
<span class="line"><span>+								return</span></span>
<span class="line"><span>+							}</span></span>
<span class="line"><span> 							// 如果当前日期大于已有日期，将当前的添加到数组尾部</span></span>
<span class="line"><span> 							selected.push(date)</span></span>
<span class="line"><span> 							const startDate = selected[0]</span></span>
<span class="line"><span>@@ -450,6 +463,11 @@</span></span>
<span class="line"><span> 				})</span></span>
<span class="line"><span> 				this.setSelected(defaultDate, false)</span></span>
<span class="line"><span> 			},</span></span>
<span class="line"><span>+			// 重置</span></span>
<span class="line"><span>+			reset() {</span></span>
<span class="line"><span>+				this.setSelected([])</span></span>
<span class="line"><span>+			},</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span> 			setSelected(selected, event = true) {</span></span>
<span class="line"><span> 				this.selected = selected</span></span>
<span class="line"><span> 				event &amp;&amp; this.$emit(&#39;monthSelected&#39;, this.selected,&#39;tap&#39;)</span></span>
<span class="line"><span>diff --git a/components/u-calendar/props.js b/components/u-calendar/props.js</span></span>
<span class="line"><span>index df990fd661bbaf1320e00c46a27c50ef207907ef..526f30db7c133783e646c9fdec98fac5f967c7f4 100644</span></span>
<span class="line"><span>--- a/components/u-calendar/props.js</span></span>
<span class="line"><span>+++ b/components/u-calendar/props.js</span></span>
<span class="line"><span>@@ -118,6 +118,11 @@ export const props = defineMixin({</span></span>
<span class="line"><span>             type: [Number, String],</span></span>
<span class="line"><span>             default: () =&gt; defProps.calendar.maxRange</span></span>
<span class="line"><span>         },</span></span>
<span class="line"><span>+        // 日期区间最多可选天数，默认无限制，mode = range时有效</span></span>
<span class="line"><span>+        minRange: {</span></span>
<span class="line"><span>+            type: [Number, String],</span></span>
<span class="line"><span>+            default: () =&gt; defProps.calendar.minRange</span></span>
<span class="line"><span>+        },</span></span>
<span class="line"><span>         // 范围选择超过最多可选天数时的提示文案，mode = range时有效</span></span>
<span class="line"><span>         rangePrompt: {</span></span>
<span class="line"><span>             type: String,</span></span>
<span class="line"><span>diff --git a/components/u-calendar/u-calendar.vue b/components/u-calendar/u-calendar.vue</span></span>
<span class="line"><span>index c8f77ff6df6f323016ca565da3ce176d2512eb85..5987472cd8e3df1b20482f092a68c2456b823a61 100644</span></span>
<span class="line"><span>--- a/components/u-calendar/u-calendar.vue</span></span>
<span class="line"><span>+++ b/components/u-calendar/u-calendar.vue</span></span>
<span class="line"><span>@@ -1,66 +1,65 @@</span></span>
<span class="line"><span> &lt;template&gt;</span></span>
<span class="line"><span>-	&lt;u-popup</span></span>
<span class="line"><span>-		:show=&quot;show&quot;</span></span>
<span class="line"><span>-		mode=&quot;bottom&quot;</span></span>
<span class="line"><span>-		closeable</span></span>
<span class="line"><span>-		@close=&quot;close&quot;</span></span>
<span class="line"><span>-		:round=&quot;round&quot;</span></span>
<span class="line"><span>-		:closeOnClickOverlay=&quot;closeOnClickOverlay&quot;</span></span>
<span class="line"><span>-	&gt;</span></span>
<span class="line"><span>-		&lt;view class=&quot;u-calendar&quot;&gt;</span></span>
<span class="line"><span>-			&lt;uHeader</span></span>
<span class="line"><span>-				:title=&quot;title&quot;</span></span>
<span class="line"><span>-				:subtitle=&quot;subtitle&quot;</span></span>
<span class="line"><span>-				:showSubtitle=&quot;showSubtitle&quot;</span></span>
<span class="line"><span>-				:showTitle=&quot;showTitle&quot;</span></span>
<span class="line"><span>-			&gt;&lt;/uHeader&gt;</span></span>
<span class="line"><span>-			&lt;scroll-view</span></span>
<span class="line"><span>-				:style=&quot;{</span></span>
<span class="line"><span>-                    height: addUnit(listHeight)</span></span>
<span class="line"><span>-                }&quot;</span></span>
<span class="line"><span>-				scroll-y</span></span>
<span class="line"><span>-				@scroll=&quot;onScroll&quot;</span></span>
<span class="line"><span>-				:scroll-top=&quot;scrollTop&quot;</span></span>
<span class="line"><span>-				:scrollIntoView=&quot;scrollIntoView&quot;</span></span>
<span class="line"><span>-			&gt;</span></span>
<span class="line"><span>-				&lt;uMonth</span></span>
<span class="line"><span>-					:color=&quot;color&quot;</span></span>
<span class="line"><span>-					:rowHeight=&quot;rowHeight&quot;</span></span>
<span class="line"><span>-					:showMark=&quot;showMark&quot;</span></span>
<span class="line"><span>-					:months=&quot;months&quot;</span></span>
<span class="line"><span>-					:mode=&quot;mode&quot;</span></span>
<span class="line"><span>-					:maxCount=&quot;maxCount&quot;</span></span>
<span class="line"><span>-					:startText=&quot;startText&quot;</span></span>
<span class="line"><span>-					:endText=&quot;endText&quot;</span></span>
<span class="line"><span>-					:defaultDate=&quot;defaultDate&quot;</span></span>
<span class="line"><span>-					:minDate=&quot;innerMinDate&quot;</span></span>
<span class="line"><span>-					:maxDate=&quot;innerMaxDate&quot;</span></span>
<span class="line"><span>-					:maxMonth=&quot;monthNum&quot;</span></span>
<span class="line"><span>-					:readonly=&quot;readonly&quot;</span></span>
<span class="line"><span>-					:maxRange=&quot;maxRange&quot;</span></span>
<span class="line"><span>-					:rangePrompt=&quot;rangePrompt&quot;</span></span>
<span class="line"><span>-					:showRangePrompt=&quot;showRangePrompt&quot;</span></span>
<span class="line"><span>-					:allowSameDay=&quot;allowSameDay&quot;</span></span>
<span class="line"><span>-					ref=&quot;month&quot;</span></span>
<span class="line"><span>-					@monthSelected=&quot;monthSelected&quot;</span></span>
<span class="line"><span>-					@updateMonthTop=&quot;updateMonthTop&quot;</span></span>
<span class="line"><span>-				&gt;&lt;/uMonth&gt;</span></span>
<span class="line"><span>-			&lt;/scroll-view&gt;</span></span>
<span class="line"><span>-			&lt;slot name=&quot;footer&quot; v-if=&quot;showConfirm&quot;&gt;</span></span>
<span class="line"><span>-				&lt;view class=&quot;u-calendar__confirm&quot;&gt;</span></span>
<span class="line"><span>-					&lt;u-button</span></span>
<span class="line"><span>-						shape=&quot;circle&quot;</span></span>
<span class="line"><span>-						:text=&quot;</span></span>
<span class="line"><span>-                            buttonDisabled ? confirmDisabledText : confirmText</span></span>
<span class="line"><span>-                        &quot;</span></span>
<span class="line"><span>-						:color=&quot;color&quot;</span></span>
<span class="line"><span>-						@click=&quot;confirm&quot;</span></span>
<span class="line"><span>-						:disabled=&quot;buttonDisabled&quot;</span></span>
<span class="line"><span>-					&gt;&lt;/u-button&gt;</span></span>
<span class="line"><span>-				&lt;/view&gt;</span></span>
<span class="line"><span>-			&lt;/slot&gt;</span></span>
<span class="line"><span>-		&lt;/view&gt;</span></span>
<span class="line"><span>-	&lt;/u-popup&gt;</span></span>
<span class="line"><span>+  &lt;u-popup</span></span>
<span class="line"><span>+    :show=&quot;show&quot;</span></span>
<span class="line"><span>+    mode=&quot;bottom&quot;</span></span>
<span class="line"><span>+    closeable</span></span>
<span class="line"><span>+    @close=&quot;close&quot;</span></span>
<span class="line"><span>+    :round=&quot;round&quot;</span></span>
<span class="line"><span>+    :closeOnClickOverlay=&quot;closeOnClickOverlay&quot;</span></span>
<span class="line"><span>+  &gt;</span></span>
<span class="line"><span>+    &lt;view class=&quot;u-calendar&quot;&gt;</span></span>
<span class="line"><span>+      &lt;uHeader</span></span>
<span class="line"><span>+        :title=&quot;title&quot;</span></span>
<span class="line"><span>+        :subtitle=&quot;subtitle&quot;</span></span>
<span class="line"><span>+        :showSubtitle=&quot;showSubtitle&quot;</span></span>
<span class="line"><span>+        :showTitle=&quot;showTitle&quot;</span></span>
<span class="line"><span>+      &gt;&lt;/uHeader&gt;</span></span>
<span class="line"><span>+      &lt;scroll-view</span></span>
<span class="line"><span>+        :style=&quot;{</span></span>
<span class="line"><span>+          height: addUnit(listHeight),</span></span>
<span class="line"><span>+        }&quot;</span></span>
<span class="line"><span>+        scroll-y</span></span>
<span class="line"><span>+        @scroll=&quot;onScroll&quot;</span></span>
<span class="line"><span>+        :scroll-top=&quot;scrollTop&quot;</span></span>
<span class="line"><span>+        :scrollIntoView=&quot;scrollIntoView&quot;</span></span>
<span class="line"><span>+      &gt;</span></span>
<span class="line"><span>+        &lt;uMonth</span></span>
<span class="line"><span>+          :color=&quot;color&quot;</span></span>
<span class="line"><span>+          :rowHeight=&quot;rowHeight&quot;</span></span>
<span class="line"><span>+          :showMark=&quot;showMark&quot;</span></span>
<span class="line"><span>+          :months=&quot;months&quot;</span></span>
<span class="line"><span>+          :mode=&quot;mode&quot;</span></span>
<span class="line"><span>+          :maxCount=&quot;maxCount&quot;</span></span>
<span class="line"><span>+          :startText=&quot;startText&quot;</span></span>
<span class="line"><span>+          :endText=&quot;endText&quot;</span></span>
<span class="line"><span>+          :defaultDate=&quot;defaultDate&quot;</span></span>
<span class="line"><span>+          :minDate=&quot;innerMinDate&quot;</span></span>
<span class="line"><span>+          :maxDate=&quot;innerMaxDate&quot;</span></span>
<span class="line"><span>+          :maxMonth=&quot;monthNum&quot;</span></span>
<span class="line"><span>+          :readonly=&quot;readonly&quot;</span></span>
<span class="line"><span>+          :maxRange=&quot;maxRange&quot;</span></span>
<span class="line"><span>+          :minRange=&quot;minRange&quot;</span></span>
<span class="line"><span>+          :rangePrompt=&quot;rangePrompt&quot;</span></span>
<span class="line"><span>+          :showRangePrompt=&quot;showRangePrompt&quot;</span></span>
<span class="line"><span>+          :allowSameDay=&quot;allowSameDay&quot;</span></span>
<span class="line"><span>+          ref=&quot;month&quot;</span></span>
<span class="line"><span>+          @monthSelected=&quot;monthSelected&quot;</span></span>
<span class="line"><span>+          @updateMonthTop=&quot;updateMonthTop&quot;</span></span>
<span class="line"><span>+        &gt;&lt;/uMonth&gt;</span></span>
<span class="line"><span>+      &lt;/scroll-view&gt;</span></span>
<span class="line"><span>+      &lt;slot name=&quot;footer&quot; v-if=&quot;showConfirm&quot;&gt;</span></span>
<span class="line"><span>+        &lt;view class=&quot;u-calendar__confirm&quot;&gt;</span></span>
<span class="line"><span>+          &lt;u-button</span></span>
<span class="line"><span>+            shape=&quot;circle&quot;</span></span>
<span class="line"><span>+            :text=&quot;buttonDisabled ? confirmDisabledText : confirmText&quot;</span></span>
<span class="line"><span>+            :color=&quot;color&quot;</span></span>
<span class="line"><span>+            @click=&quot;confirm&quot;</span></span>
<span class="line"><span>+            :disabled=&quot;buttonDisabled&quot;</span></span>
<span class="line"><span>+          &gt;&lt;/u-button&gt;</span></span>
<span class="line"><span>+        &lt;/view&gt;</span></span>
<span class="line"><span>+      &lt;/slot&gt;</span></span>
<span class="line"><span>+    &lt;/view&gt;</span></span>
<span class="line"><span>+  &lt;/u-popup&gt;</span></span>
<span class="line"><span> &lt;/template&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> &lt;script&gt;</span></span>
<span class="line"><span>@@ -72,8 +71,8 @@ import dayjs from &#39;dayjs/esm/index&#39;</span></span>
<span class="line"><span> import Calendar from &#39;../../libs/util/calendar.js&#39;</span></span>
<span class="line"><span> import { mpMixin } from &#39;../../libs/mixin/mpMixin.js&#39;</span></span>
<span class="line"><span> import { mixin } from &#39;../../libs/mixin/mixin.js&#39;</span></span>
<span class="line"><span>-import { addUnit, range, error, padZero } from &#39;../../libs/function/index&#39;;</span></span>
<span class="line"><span>-import test from &#39;../../libs/function/test&#39;;</span></span>
<span class="line"><span>+import { addUnit, range, error, padZero } from &#39;../../libs/function/index&#39;</span></span>
<span class="line"><span>+import test from &#39;../../libs/function/test&#39;</span></span>
<span class="line"><span> /**</span></span>
<span class="line"><span>  * Calendar 日历</span></span>
<span class="line"><span>  * @description  此组件用于单个选择日期，范围选择日期等，日历被包裹在底部弹起的容器中.</span></span>
<span class="line"><span>@@ -101,6 +100,7 @@ import test from &#39;../../libs/function/test&#39;;</span></span>
<span class="line"><span>  * @property {Boolean}				closeOnClickOverlay	是否允许点击遮罩关闭日历 (默认 false )</span></span>
<span class="line"><span>  * @property {Boolean}				readonly	        是否为只读状态，只读状态下禁止选择日期 (默认 false )</span></span>
<span class="line"><span>  * @property {String | Number}		maxRange	        日期区间最多可选天数，默认无限制，mode = range时有效</span></span>
<span class="line"><span>+ * @property {String | Number}		minRange	        日期区间最少可选天数，默认无限制，mode = range时有效</span></span>
<span class="line"><span>  * @property {String}				rangePrompt	        范围选择超过最多可选天数时的提示文案，mode = range时有效</span></span>
<span class="line"><span>  * @property {Boolean}				showRangePrompt	    范围选择超过最多可选天数时，是否展示提示文案，mode = range时有效 (默认 true )</span></span>
<span class="line"><span>  * @property {Boolean}				allowSameDay	    是否允许日期范围的起止时间为同一天，mode = range时有效 (默认 false )</span></span>
<span class="line"><span>@@ -113,288 +113,272 @@ import test from &#39;../../libs/function/test&#39;;</span></span>
<span class="line"><span> 	&lt;/u-calendar&gt;</span></span>
<span class="line"><span>  * */</span></span>
<span class="line"><span> export default {</span></span>
<span class="line"><span>-	name: &#39;u-calendar&#39;,</span></span>
<span class="line"><span>-	mixins: [mpMixin, mixin, props],</span></span>
<span class="line"><span>-	components: {</span></span>
<span class="line"><span>-		uHeader,</span></span>
<span class="line"><span>-		uMonth</span></span>
<span class="line"><span>-	},</span></span>
<span class="line"><span>-	data() {</span></span>
<span class="line"><span>-		return {</span></span>
<span class="line"><span>-			// 需要显示的月份的数组</span></span>
<span class="line"><span>-			months: [],</span></span>
<span class="line"><span>-			// 在月份滚动区域中，当前视图中月份的index索引</span></span>
<span class="line"><span>-			monthIndex: 0,</span></span>
<span class="line"><span>-			// 月份滚动区域的高度</span></span>
<span class="line"><span>-			listHeight: 0,</span></span>
<span class="line"><span>-			// month组件中选择的日期数组</span></span>
<span class="line"><span>-			selected: [],</span></span>
<span class="line"><span>-			scrollIntoView: &#39;&#39;,</span></span>
<span class="line"><span>-			scrollIntoViewScroll: &#39;&#39;,</span></span>
<span class="line"><span>-			scrollTop:0,</span></span>
<span class="line"><span>-			// 过滤处理方法</span></span>
<span class="line"><span>-			innerFormatter: (value) =&gt; value</span></span>
<span class="line"><span>-		}</span></span>
<span class="line"><span>-	},</span></span>
<span class="line"><span>-	watch: {</span></span>
<span class="line"><span>-		scrollIntoView: {</span></span>
<span class="line"><span>-			immediate: true,</span></span>
<span class="line"><span>-			handler(n) {</span></span>
<span class="line"><span>-				// console.log(&#39;scrollIntoView&#39;, n)</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		selectedChange: {</span></span>
<span class="line"><span>-			immediate: true,</span></span>
<span class="line"><span>-			handler(n) {</span></span>
<span class="line"><span>-				this.setMonth()</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// 打开弹窗时，设置月份数据</span></span>
<span class="line"><span>-		show: {</span></span>
<span class="line"><span>-			immediate: true,</span></span>
<span class="line"><span>-			handler(n) {</span></span>
<span class="line"><span>-				if (n) {</span></span>
<span class="line"><span>-					this.setMonth()</span></span>
<span class="line"><span>-				} else {</span></span>
<span class="line"><span>-					// 关闭时重置scrollIntoView，否则会出现二次打开日历，当前月份数据显示不正确。</span></span>
<span class="line"><span>-					// scrollIntoView需要有一个值变动过程，才会产生作用。</span></span>
<span class="line"><span>-					this.scrollIntoView = &#39;&#39;</span></span>
<span class="line"><span>-				}</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		}</span></span>
<span class="line"><span>-	},</span></span>
<span class="line"><span>-	computed: {</span></span>
<span class="line"><span>-		// 由于maxDate和minDate可以为字符串(2021-10-10)，或者数值(时间戳)，但是dayjs如果接受字符串形式的时间戳会有问题，这里进行处理</span></span>
<span class="line"><span>-		innerMaxDate() {</span></span>
<span class="line"><span>-			return test.number(this.maxDate)</span></span>
<span class="line"><span>-				? Number(this.maxDate)</span></span>
<span class="line"><span>-				: this.maxDate</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		innerMinDate() {</span></span>
<span class="line"><span>-			return test.number(this.minDate)</span></span>
<span class="line"><span>-				? Number(this.minDate)</span></span>
<span class="line"><span>-				: this.minDate</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// 多个条件的变化，会引起选中日期的变化，这里统一管理监听</span></span>
<span class="line"><span>-		selectedChange() {</span></span>
<span class="line"><span>-			return [this.innerMinDate, this.innerMaxDate, this.defaultDate]</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		subtitle() {</span></span>
<span class="line"><span>-			// 初始化时，this.months为空数组，所以需要特别判断处理</span></span>
<span class="line"><span>-			if (this.months.length) {</span></span>
<span class="line"><span>-				return \`\${this.months[this.monthIndex].year}年\${</span></span>
<span class="line"><span>-					this.months[this.monthIndex].month</span></span>
<span class="line"><span>-				}月\`</span></span>
<span class="line"><span>-			} else {</span></span>
<span class="line"><span>-				return &#39;&#39;</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		buttonDisabled() {</span></span>
<span class="line"><span>-			// 如果为range类型，且选择的日期个数不足1个时，让底部的按钮出于disabled状态</span></span>
<span class="line"><span>-			if (this.mode === &#39;range&#39;) {</span></span>
<span class="line"><span>-				if (this.selected.length &lt;= 1) {</span></span>
<span class="line"><span>-					return true</span></span>
<span class="line"><span>-				} else {</span></span>
<span class="line"><span>-					return false</span></span>
<span class="line"><span>-				}</span></span>
<span class="line"><span>-			} else {</span></span>
<span class="line"><span>-				return false</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		}</span></span>
<span class="line"><span>-	},</span></span>
<span class="line"><span>-	mounted() {</span></span>
<span class="line"><span>-		this.start = Date.now()</span></span>
<span class="line"><span>-		this.init()</span></span>
<span class="line"><span>-	},</span></span>
<span class="line"><span>-	emits: [&quot;confirm&quot;, &quot;close&quot;],</span></span>
<span class="line"><span>-	methods: {</span></span>
<span class="line"><span>-		addUnit,</span></span>
<span class="line"><span>-		// 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用</span></span>
<span class="line"><span>-		setFormatter(e) {</span></span>
<span class="line"><span>-			this.innerFormatter = e</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// month组件内部选择日期后，通过事件通知给父组件</span></span>
<span class="line"><span>-		monthSelected(e,scene =&#39;init&#39;) {</span></span>
<span class="line"><span>-			this.selected = e</span></span>
<span class="line"><span>-			if (!this.showConfirm) {</span></span>
<span class="line"><span>-				// 在不需要确认按钮的情况下，如果为单选，或者范围多选且已选长度大于2，则直接进行返还</span></span>
<span class="line"><span>-				if (</span></span>
<span class="line"><span>-					this.mode === &#39;multiple&#39; ||</span></span>
<span class="line"><span>-					this.mode === &#39;single&#39; ||</span></span>
<span class="line"><span>-					(this.mode === &#39;range&#39; &amp;&amp; this.selected.length &gt;= 2)</span></span>
<span class="line"><span>-				) {</span></span>
<span class="line"><span>-				   if( scene === &#39;init&#39;){</span></span>
<span class="line"><span>-					 return</span></span>
<span class="line"><span>-				   }</span></span>
<span class="line"><span>-				   if( scene === &#39;tap&#39;) {</span></span>
<span class="line"><span>-					 this.$emit(&#39;confirm&#39;, this.selected)</span></span>
<span class="line"><span>-				   }</span></span>
<span class="line"><span>-				}</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		init() {</span></span>
<span class="line"><span>-			// 校验maxDate，不能小于minDate。</span></span>
<span class="line"><span>-			if (</span></span>
<span class="line"><span>-				this.innerMaxDate &amp;&amp;</span></span>
<span class="line"><span>-                this.innerMinDate &amp;&amp;</span></span>
<span class="line"><span>-				new Date(this.innerMaxDate).getTime() &lt; new Date(this.innerMinDate).getTime()</span></span>
<span class="line"><span>-			) {</span></span>
<span class="line"><span>-				return error(&#39;maxDate不能小于minDate时间&#39;)</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-			// 滚动区域的高度</span></span>
<span class="line"><span>-			this.listHeight = this.rowHeight * 5 + 30</span></span>
<span class="line"><span>-			this.setMonth()</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		close() {</span></span>
<span class="line"><span>-			this.$emit(&#39;close&#39;)</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// 点击确定按钮</span></span>
<span class="line"><span>-		confirm() {</span></span>
<span class="line"><span>-			if (!this.buttonDisabled) {</span></span>
<span class="line"><span>-				this.$emit(&#39;confirm&#39;, this.selected)</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// 获得两个日期之间的月份数</span></span>
<span class="line"><span>-		getMonths(minDate, maxDate) {</span></span>
<span class="line"><span>-			const minYear = dayjs(minDate).year()</span></span>
<span class="line"><span>-			const minMonth = dayjs(minDate).month() + 1</span></span>
<span class="line"><span>-			const maxYear = dayjs(maxDate).year()</span></span>
<span class="line"><span>-			const maxMonth = dayjs(maxDate).month() + 1</span></span>
<span class="line"><span>-			return (maxYear - minYear) * 12 + (maxMonth - minMonth) + 1</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// 设置月份数据</span></span>
<span class="line"><span>-		setMonth() {</span></span>
<span class="line"><span>-			// 最小日期的毫秒数</span></span>
<span class="line"><span>-			const minDate = this.innerMinDate || dayjs().valueOf()</span></span>
<span class="line"><span>-			// 如果没有指定最大日期，则往后推3个月</span></span>
<span class="line"><span>-			const maxDate =</span></span>
<span class="line"><span>-				this.innerMaxDate ||</span></span>
<span class="line"><span>-				dayjs(minDate)</span></span>
<span class="line"><span>-					.add(this.monthNum - 1, &#39;month&#39;)</span></span>
<span class="line"><span>-					.valueOf()</span></span>
<span class="line"><span>-			// 最大最小月份之间的共有多少个月份，</span></span>
<span class="line"><span>-			const months = range(</span></span>
<span class="line"><span>-				1,</span></span>
<span class="line"><span>-				this.monthNum,</span></span>
<span class="line"><span>-				this.getMonths(minDate, maxDate)</span></span>
<span class="line"><span>-			)</span></span>
<span class="line"><span>-			// 先清空数组</span></span>
<span class="line"><span>-			this.months = []</span></span>
<span class="line"><span>-			for (let i = 0; i &lt; months; i++) {</span></span>
<span class="line"><span>-				this.months.push({</span></span>
<span class="line"><span>-					date: new Array(</span></span>
<span class="line"><span>-						dayjs(minDate).add(i, &#39;month&#39;).daysInMonth()</span></span>
<span class="line"><span>-					)</span></span>
<span class="line"><span>-						.fill(1)</span></span>
<span class="line"><span>-						.map((item, index) =&gt; {</span></span>
<span class="line"><span>-							// 日期，取值1-31</span></span>
<span class="line"><span>-							let day = index + 1</span></span>
<span class="line"><span>-							// 星期，0-6，0为周日</span></span>
<span class="line"><span>-							const week = dayjs(minDate)</span></span>
<span class="line"><span>-								.add(i, &#39;month&#39;)</span></span>
<span class="line"><span>-								.date(day)</span></span>
<span class="line"><span>-								.day()</span></span>
<span class="line"><span>-							const date = dayjs(minDate)</span></span>
<span class="line"><span>-								.add(i, &#39;month&#39;)</span></span>
<span class="line"><span>-								.date(day)</span></span>
<span class="line"><span>-								.format(&#39;YYYY-MM-DD&#39;)</span></span>
<span class="line"><span>-							let bottomInfo = &#39;&#39;</span></span>
<span class="line"><span>-							if (this.showLunar) {</span></span>
<span class="line"><span>-								// 将日期转为农历格式</span></span>
<span class="line"><span>-								const lunar = Calendar.solar2lunar(</span></span>
<span class="line"><span>-									dayjs(date).year(),</span></span>
<span class="line"><span>-									dayjs(date).month() + 1,</span></span>
<span class="line"><span>-									dayjs(date).date()</span></span>
<span class="line"><span>-								)</span></span>
<span class="line"><span>-								bottomInfo = lunar.IDayCn</span></span>
<span class="line"><span>-							}</span></span>
<span class="line"><span>-							let config = {</span></span>
<span class="line"><span>-								day,</span></span>
<span class="line"><span>-								week,</span></span>
<span class="line"><span>-								// 小于最小允许的日期，或者大于最大的日期，则设置为disabled状态</span></span>
<span class="line"><span>-								disabled:</span></span>
<span class="line"><span>-									dayjs(date).isBefore(</span></span>
<span class="line"><span>-										dayjs(minDate).format(&#39;YYYY-MM-DD&#39;)</span></span>
<span class="line"><span>-									) ||</span></span>
<span class="line"><span>-									dayjs(date).isAfter(</span></span>
<span class="line"><span>-										dayjs(maxDate).format(&#39;YYYY-MM-DD&#39;)</span></span>
<span class="line"><span>-									),</span></span>
<span class="line"><span>-								// 返回一个日期对象，供外部的formatter获取当前日期的年月日等信息，进行加工处理</span></span>
<span class="line"><span>-								date: new Date(date),</span></span>
<span class="line"><span>-								bottomInfo,</span></span>
<span class="line"><span>-								dot: false,</span></span>
<span class="line"><span>-								month:</span></span>
<span class="line"><span>-									dayjs(minDate).add(i, &#39;month&#39;).month() + 1</span></span>
<span class="line"><span>-							}</span></span>
<span class="line"><span>-							const formatter =</span></span>
<span class="line"><span>-								this.formatter || this.innerFormatter</span></span>
<span class="line"><span>-							return formatter(config)</span></span>
<span class="line"><span>-						}),</span></span>
<span class="line"><span>-					// 当前所属的月份</span></span>
<span class="line"><span>-					month: dayjs(minDate).add(i, &#39;month&#39;).month() + 1,</span></span>
<span class="line"><span>-					// 当前年份</span></span>
<span class="line"><span>-					year: dayjs(minDate).add(i, &#39;month&#39;).year()</span></span>
<span class="line"><span>-				})</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// 滚动到默认设置的月份</span></span>
<span class="line"><span>-		scrollIntoDefaultMonth(selected) {</span></span>
<span class="line"><span>-			// 查询默认日期在可选列表的下标</span></span>
<span class="line"><span>-			const _index = this.months.findIndex(({</span></span>
<span class="line"><span>-				  year,</span></span>
<span class="line"><span>-				  month</span></span>
<span class="line"><span>-			  }) =&gt; {</span></span>
<span class="line"><span>-				month = padZero(month)</span></span>
<span class="line"><span>-				return \`\${year}-\${month}\` === selected</span></span>
<span class="line"><span>-			})</span></span>
<span class="line"><span>-			if (_index !== -1) {</span></span>
<span class="line"><span>-				// #ifndef MP-WEIXIN</span></span>
<span class="line"><span>-				this.$nextTick(() =&gt; {</span></span>
<span class="line"><span>-					this.scrollIntoView = \`month-\${_index}\`</span></span>
<span class="line"><span>-					this.scrollIntoViewScroll = this.scrollIntoView</span></span>
<span class="line"><span>-				})</span></span>
<span class="line"><span>-				// #endif</span></span>
<span class="line"><span>-				// #ifdef MP-WEIXIN</span></span>
<span class="line"><span>-				this.scrollTop = this.months[_index].top || 0;</span></span>
<span class="line"><span>-				// #endif</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// scroll-view滚动监听</span></span>
<span class="line"><span>-		onScroll(event) {</span></span>
<span class="line"><span>-			// 不允许小于0的滚动值，如果scroll-view到顶了，继续下拉，会出现负数值</span></span>
<span class="line"><span>-			const scrollTop = Math.max(0, event.detail.scrollTop)</span></span>
<span class="line"><span>-			// 将当前滚动条数值，除以滚动区域的高度，可以得出当前滚动到了哪一个月份的索引</span></span>
<span class="line"><span>-			for (let i = 0; i &lt; this.months.length; i++) {</span></span>
<span class="line"><span>-				if (scrollTop &gt;= (this.months[i].top || this.listHeight)) {</span></span>
<span class="line"><span>-					this.monthIndex = i</span></span>
<span class="line"><span>-					this.scrollIntoViewScroll = \`month-\${i}\`</span></span>
<span class="line"><span>-				}</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-		},</span></span>
<span class="line"><span>-		// 更新月份的top值</span></span>
<span class="line"><span>-		updateMonthTop(topArr = []) {</span></span>
<span class="line"><span>-			// 设置对应月份的top值，用于onScroll方法更新月份</span></span>
<span class="line"><span>-			topArr.map((item, index) =&gt; {</span></span>
<span class="line"><span>-				this.months[index].top = item</span></span>
<span class="line"><span>-			})</span></span>
<span class="line"><span>+  name: &#39;u-calendar&#39;,</span></span>
<span class="line"><span>+  mixins: [mpMixin, mixin, props],</span></span>
<span class="line"><span>+  components: {</span></span>
<span class="line"><span>+    uHeader,</span></span>
<span class="line"><span>+    uMonth,</span></span>
<span class="line"><span>+  },</span></span>
<span class="line"><span>+  data() {</span></span>
<span class="line"><span>+    return {</span></span>
<span class="line"><span>+      // 需要显示的月份的数组</span></span>
<span class="line"><span>+      months: [],</span></span>
<span class="line"><span>+      // 在月份滚动区域中，当前视图中月份的index索引</span></span>
<span class="line"><span>+      monthIndex: 0,</span></span>
<span class="line"><span>+      // 月份滚动区域的高度</span></span>
<span class="line"><span>+      listHeight: 0,</span></span>
<span class="line"><span>+      // month组件中选择的日期数组</span></span>
<span class="line"><span>+      selected: [],</span></span>
<span class="line"><span>+      scrollIntoView: &#39;&#39;,</span></span>
<span class="line"><span>+      scrollIntoViewScroll: &#39;&#39;,</span></span>
<span class="line"><span>+      scrollTop: 0,</span></span>
<span class="line"><span>+      // 过滤处理方法</span></span>
<span class="line"><span>+      innerFormatter: (value) =&gt; value,</span></span>
<span class="line"><span>+    }</span></span>
<span class="line"><span>+  },</span></span>
<span class="line"><span>+  watch: {</span></span>
<span class="line"><span>+    scrollIntoView: {</span></span>
<span class="line"><span>+      immediate: true,</span></span>
<span class="line"><span>+      handler(n) {</span></span>
<span class="line"><span>+        // console.log(&#39;scrollIntoView&#39;, n)</span></span>
<span class="line"><span>+      },</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    selectedChange: {</span></span>
<span class="line"><span>+      immediate: true,</span></span>
<span class="line"><span>+      handler(n) {</span></span>
<span class="line"><span>+        this.setMonth()</span></span>
<span class="line"><span>+      },</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // 打开弹窗时，设置月份数据</span></span>
<span class="line"><span>+    show: {</span></span>
<span class="line"><span>+      immediate: true,</span></span>
<span class="line"><span>+      handler(n) {</span></span>
<span class="line"><span>+        if (n) {</span></span>
<span class="line"><span>+          this.setMonth()</span></span>
<span class="line"><span>+        } else {</span></span>
<span class="line"><span>+          // 关闭时重置scrollIntoView，否则会出现二次打开日历，当前月份数据显示不正确。</span></span>
<span class="line"><span>+          // scrollIntoView需要有一个值变动过程，才会产生作用。</span></span>
<span class="line"><span>+          this.scrollIntoView = &#39;&#39;</span></span>
<span class="line"><span>+        }</span></span>
<span class="line"><span>+      },</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+  },</span></span>
<span class="line"><span>+  computed: {</span></span>
<span class="line"><span>+    // 由于maxDate和minDate可以为字符串(2021-10-10)，或者数值(时间戳)，但是dayjs如果接受字符串形式的时间戳会有问题，这里进行处理</span></span>
<span class="line"><span>+    innerMaxDate() {</span></span>
<span class="line"><span>+      return test.number(this.maxDate) ? Number(this.maxDate) : this.maxDate</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    innerMinDate() {</span></span>
<span class="line"><span>+      return test.number(this.minDate) ? Number(this.minDate) : this.minDate</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // 多个条件的变化，会引起选中日期的变化，这里统一管理监听</span></span>
<span class="line"><span>+    selectedChange() {</span></span>
<span class="line"><span>+      return [this.innerMinDate, this.innerMaxDate, this.defaultDate]</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    subtitle() {</span></span>
<span class="line"><span>+      // 初始化时，this.months为空数组，所以需要特别判断处理</span></span>
<span class="line"><span>+      if (this.months.length) {</span></span>
<span class="line"><span>+        return \`\${this.months[this.monthIndex].year}年\${</span></span>
<span class="line"><span>+          this.months[this.monthIndex].month</span></span>
<span class="line"><span>+        }月\`</span></span>
<span class="line"><span>+      } else {</span></span>
<span class="line"><span>+        return &#39;&#39;</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    buttonDisabled() {</span></span>
<span class="line"><span>+      // 如果为range类型，且选择的日期个数不足1个时，让底部的按钮出于disabled状态</span></span>
<span class="line"><span>+      if (this.mode === &#39;range&#39;) {</span></span>
<span class="line"><span>+        if (this.selected.length &lt;= 1) {</span></span>
<span class="line"><span>+          return true</span></span>
<span class="line"><span>+        } else {</span></span>
<span class="line"><span>+          return false</span></span>
<span class="line"><span>+        }</span></span>
<span class="line"><span>+      } else {</span></span>
<span class="line"><span>+        return false</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+  },</span></span>
<span class="line"><span>+  mounted() {</span></span>
<span class="line"><span>+    this.start = Date.now()</span></span>
<span class="line"><span>+    this.init()</span></span>
<span class="line"><span>+  },</span></span>
<span class="line"><span>+  emits: [&#39;confirm&#39;, &#39;close&#39;, &#39;onSelectClick&#39;],</span></span>
<span class="line"><span>+  methods: {</span></span>
<span class="line"><span>+    addUnit,</span></span>
<span class="line"><span>+    // 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用</span></span>
<span class="line"><span>+    setFormatter(e) {</span></span>
<span class="line"><span>+      this.innerFormatter = e</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // month组件内部选择日期后，通过事件通知给父组件</span></span>
<span class="line"><span>+    monthSelected(e, scene = &#39;init&#39;) {</span></span>
<span class="line"><span>+      this.selected = e</span></span>
<span class="line"><span>+      this.$emit(&#39;onSelectClick&#39;, e)</span></span>
<span class="line"><span>+      if (!this.showConfirm) {</span></span>
<span class="line"><span>+        // 在不需要确认按钮的情况下，如果为单选，或者范围多选且已选长度大于2，则直接进行返还</span></span>
<span class="line"><span>+        if (</span></span>
<span class="line"><span>+          this.mode === &#39;multiple&#39; ||</span></span>
<span class="line"><span>+          this.mode === &#39;single&#39; ||</span></span>
<span class="line"><span>+          (this.mode === &#39;range&#39; &amp;&amp; this.selected.length &gt;= 2)</span></span>
<span class="line"><span>+        ) {</span></span>
<span class="line"><span>+          if (scene === &#39;init&#39;) {</span></span>
<span class="line"><span>+            return</span></span>
<span class="line"><span>+          }</span></span>
<span class="line"><span>+          if (scene === &#39;tap&#39;) {</span></span>
<span class="line"><span>+            this.$emit(&#39;confirm&#39;, this.selected)</span></span>
<span class="line"><span>+          }</span></span>
<span class="line"><span>+        }</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // 重置日期</span></span>
<span class="line"><span>+    reset() {</span></span>
<span class="line"><span>+      this.$refs.month.reset()</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    init() {</span></span>
<span class="line"><span>+      // 校验maxDate，不能小于minDate。</span></span>
<span class="line"><span>+      if (</span></span>
<span class="line"><span>+        this.innerMaxDate &amp;&amp;</span></span>
<span class="line"><span>+        this.innerMinDate &amp;&amp;</span></span>
<span class="line"><span>+        new Date(this.innerMaxDate).getTime() &lt;</span></span>
<span class="line"><span>+          new Date(this.innerMinDate).getTime()</span></span>
<span class="line"><span>+      ) {</span></span>
<span class="line"><span>+        return error(&#39;maxDate不能小于minDate时间&#39;)</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+      // 滚动区域的高度</span></span>
<span class="line"><span>+      this.listHeight = this.rowHeight * 5 + 30</span></span>
<span class="line"><span>+      this.setMonth()</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    close() {</span></span>
<span class="line"><span>+      this.$emit(&#39;close&#39;)</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // 点击确定按钮</span></span>
<span class="line"><span>+    confirm() {</span></span>
<span class="line"><span>+      if (!this.buttonDisabled) {</span></span>
<span class="line"><span>+        this.$emit(&#39;confirm&#39;, this.selected)</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // 获得两个日期之间的月份数</span></span>
<span class="line"><span>+    getMonths(minDate, maxDate) {</span></span>
<span class="line"><span>+      const minYear = dayjs(minDate).year()</span></span>
<span class="line"><span>+      const minMonth = dayjs(minDate).month() + 1</span></span>
<span class="line"><span>+      const maxYear = dayjs(maxDate).year()</span></span>
<span class="line"><span>+      const maxMonth = dayjs(maxDate).month() + 1</span></span>
<span class="line"><span>+      return (maxYear - minYear) * 12 + (maxMonth - minMonth) + 1</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // 设置月份数据</span></span>
<span class="line"><span>+    setMonth() {</span></span>
<span class="line"><span>+      // 最小日期的毫秒数</span></span>
<span class="line"><span>+      const minDate = this.innerMinDate || dayjs().valueOf()</span></span>
<span class="line"><span>+      // 如果没有指定最大日期，则往后推3个月</span></span>
<span class="line"><span>+      const maxDate =</span></span>
<span class="line"><span>+        this.innerMaxDate ||</span></span>
<span class="line"><span>+        dayjs(minDate)</span></span>
<span class="line"><span>+          .add(this.monthNum - 1, &#39;month&#39;)</span></span>
<span class="line"><span>+          .valueOf()</span></span>
<span class="line"><span>+      // 最大最小月份之间的共有多少个月份，</span></span>
<span class="line"><span>+      const months = range(1, this.monthNum, this.getMonths(minDate, maxDate))</span></span>
<span class="line"><span>+      // 先清空数组</span></span>
<span class="line"><span>+      this.months = []</span></span>
<span class="line"><span>+      for (let i = 0; i &lt; months; i++) {</span></span>
<span class="line"><span>+        this.months.push({</span></span>
<span class="line"><span>+          date: new Array(dayjs(minDate).add(i, &#39;month&#39;).daysInMonth())</span></span>
<span class="line"><span>+            .fill(1)</span></span>
<span class="line"><span>+            .map((item, index) =&gt; {</span></span>
<span class="line"><span>+              // 日期，取值1-31</span></span>
<span class="line"><span>+              let day = index + 1</span></span>
<span class="line"><span>+              // 星期，0-6，0为周日</span></span>
<span class="line"><span>+              const week = dayjs(minDate).add(i, &#39;month&#39;).date(day).day()</span></span>
<span class="line"><span>+              const date = dayjs(minDate)</span></span>
<span class="line"><span>+                .add(i, &#39;month&#39;)</span></span>
<span class="line"><span>+                .date(day)</span></span>
<span class="line"><span>+                .format(&#39;YYYY-MM-DD&#39;)</span></span>
<span class="line"><span>+              let bottomInfo = &#39;&#39;</span></span>
<span class="line"><span>+              if (this.showLunar) {</span></span>
<span class="line"><span>+                // 将日期转为农历格式</span></span>
<span class="line"><span>+                const lunar = Calendar.solar2lunar(</span></span>
<span class="line"><span>+                  dayjs(date).year(),</span></span>
<span class="line"><span>+                  dayjs(date).month() + 1,</span></span>
<span class="line"><span>+                  dayjs(date).date()</span></span>
<span class="line"><span>+                )</span></span>
<span class="line"><span>+                bottomInfo = lunar.IDayCn</span></span>
<span class="line"><span>+              }</span></span>
<span class="line"><span>+              let config = {</span></span>
<span class="line"><span>+                day,</span></span>
<span class="line"><span>+                week,</span></span>
<span class="line"><span>+                // 小于最小允许的日期，或者大于最大的日期，则设置为disabled状态</span></span>
<span class="line"><span>+                disabled:</span></span>
<span class="line"><span>+                  dayjs(date).isBefore(dayjs(minDate).format(&#39;YYYY-MM-DD&#39;)) ||</span></span>
<span class="line"><span>+                  dayjs(date).isAfter(dayjs(maxDate).format(&#39;YYYY-MM-DD&#39;)),</span></span>
<span class="line"><span>+                // 返回一个日期对象，供外部的formatter获取当前日期的年月日等信息，进行加工处理</span></span>
<span class="line"><span>+                date: new Date(date),</span></span>
<span class="line"><span>+                bottomInfo,</span></span>
<span class="line"><span>+                dot: false,</span></span>
<span class="line"><span>+                month: dayjs(minDate).add(i, &#39;month&#39;).month() + 1,</span></span>
<span class="line"><span>+              }</span></span>
<span class="line"><span>+              const formatter = this.formatter || this.innerFormatter</span></span>
<span class="line"><span>+              return formatter(config)</span></span>
<span class="line"><span>+            }),</span></span>
<span class="line"><span>+          // 当前所属的月份</span></span>
<span class="line"><span>+          month: dayjs(minDate).add(i, &#39;month&#39;).month() + 1,</span></span>
<span class="line"><span>+          // 当前年份</span></span>
<span class="line"><span>+          year: dayjs(minDate).add(i, &#39;month&#39;).year(),</span></span>
<span class="line"><span>+        })</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // 滚动到默认设置的月份</span></span>
<span class="line"><span>+    scrollIntoDefaultMonth(selected) {</span></span>
<span class="line"><span>+      // 查询默认日期在可选列表的下标</span></span>
<span class="line"><span>+      const _index = this.months.findIndex(({ year, month }) =&gt; {</span></span>
<span class="line"><span>+        month = padZero(month)</span></span>
<span class="line"><span>+        return \`\${year}-\${month}\` === selected</span></span>
<span class="line"><span>+      })</span></span>
<span class="line"><span>+      if (_index !== -1) {</span></span>
<span class="line"><span>+        // #ifndef MP-WEIXIN</span></span>
<span class="line"><span>+        this.$nextTick(() =&gt; {</span></span>
<span class="line"><span>+          this.scrollIntoView = \`month-\${_index}\`</span></span>
<span class="line"><span>+          this.scrollIntoViewScroll = this.scrollIntoView</span></span>
<span class="line"><span>+        })</span></span>
<span class="line"><span>+        // #endif</span></span>
<span class="line"><span>+        // #ifdef MP-WEIXIN</span></span>
<span class="line"><span>+        this.scrollTop = this.months[_index].top || 0</span></span>
<span class="line"><span>+        // #endif</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // scroll-view滚动监听</span></span>
<span class="line"><span>+    onScroll(event) {</span></span>
<span class="line"><span>+      // 不允许小于0的滚动值，如果scroll-view到顶了，继续下拉，会出现负数值</span></span>
<span class="line"><span>+      const scrollTop = Math.max(0, event.detail.scrollTop)</span></span>
<span class="line"><span>+      // 将当前滚动条数值，除以滚动区域的高度，可以得出当前滚动到了哪一个月份的索引</span></span>
<span class="line"><span>+      for (let i = 0; i &lt; this.months.length; i++) {</span></span>
<span class="line"><span>+        if (scrollTop &gt;= (this.months[i].top || this.listHeight)) {</span></span>
<span class="line"><span>+          this.monthIndex = i</span></span>
<span class="line"><span>+          this.scrollIntoViewScroll = \`month-\${i}\`</span></span>
<span class="line"><span>+        }</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+    // 更新月份的top值</span></span>
<span class="line"><span>+    updateMonthTop(topArr = []) {</span></span>
<span class="line"><span>+      // 设置对应月份的top值，用于onScroll方法更新月份</span></span>
<span class="line"><span>+      topArr.map((item, index) =&gt; {</span></span>
<span class="line"><span>+        this.months[index].top = item</span></span>
<span class="line"><span>+      })</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>-			// 获取默认日期的下标</span></span>
<span class="line"><span>-			if (!this.defaultDate) {</span></span>
<span class="line"><span>-				// 如果没有设置默认日期，则将当天日期设置为默认选中的日期</span></span>
<span class="line"><span>-				const selected = dayjs().format(&quot;YYYY-MM&quot;)</span></span>
<span class="line"><span>-				this.scrollIntoDefaultMonth(selected)</span></span>
<span class="line"><span>-				return</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-			let selected = dayjs().format(&quot;YYYY-MM&quot;);</span></span>
<span class="line"><span>-			// 单选模式，可以是字符串或数组，Date对象等</span></span>
<span class="line"><span>-			if (!test.array(this.defaultDate)) {</span></span>
<span class="line"><span>-				selected = dayjs(this.defaultDate).format(&quot;YYYY-MM&quot;)</span></span>
<span class="line"><span>-			} else {</span></span>
<span class="line"><span>-				selected = dayjs(this.defaultDate[0]).format(&quot;YYYY-MM&quot;);</span></span>
<span class="line"><span>-			}</span></span>
<span class="line"><span>-			this.scrollIntoDefaultMonth(selected)</span></span>
<span class="line"><span>-		}</span></span>
<span class="line"><span>-	}</span></span>
<span class="line"><span>+      // 获取默认日期的下标</span></span>
<span class="line"><span>+      if (!this.defaultDate) {</span></span>
<span class="line"><span>+        // 如果没有设置默认日期，则将当天日期设置为默认选中的日期</span></span>
<span class="line"><span>+        const selected = dayjs().format(&#39;YYYY-MM&#39;)</span></span>
<span class="line"><span>+        this.scrollIntoDefaultMonth(selected)</span></span>
<span class="line"><span>+        return</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+      let selected = dayjs().format(&#39;YYYY-MM&#39;)</span></span>
<span class="line"><span>+      // 单选模式，可以是字符串或数组，Date对象等</span></span>
<span class="line"><span>+      if (!test.array(this.defaultDate)) {</span></span>
<span class="line"><span>+        selected = dayjs(this.defaultDate).format(&#39;YYYY-MM&#39;)</span></span>
<span class="line"><span>+      } else {</span></span>
<span class="line"><span>+        selected = dayjs(this.defaultDate[0]).format(&#39;YYYY-MM&#39;)</span></span>
<span class="line"><span>+      }</span></span>
<span class="line"><span>+      this.scrollIntoDefaultMonth(selected)</span></span>
<span class="line"><span>+    },</span></span>
<span class="line"><span>+  },</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> &lt;/script&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>@@ -402,8 +386,8 @@ export default {</span></span>
<span class="line"><span> @import &#39;../../libs/css/components.scss&#39;;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> .u-calendar {</span></span>
<span class="line"><span>-	&amp;__confirm {</span></span>
<span class="line"><span>-		padding: 7px 18px;</span></span>
<span class="line"><span>-	}</span></span>
<span class="line"><span>+  &amp;__confirm {</span></span>
<span class="line"><span>+    padding: 7px 18px;</span></span>
<span class="line"><span>+  }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> &lt;/style&gt;</span></span></code></pre></div></details>`,7)]))}const h=s(l,[["render",e]]);export{u as __pageData,h as default};
