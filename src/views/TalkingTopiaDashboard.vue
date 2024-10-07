<script setup>
import { useLayout } from '@/layout/composables/layout';
import { DashboardService } from '@/service/DashboardService';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router'; // 引入 Vue Router 來做跳轉

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const dashboardDatas = ref(null);
const popularCourse = ref(0);
const proportion = ref(0);
const memberTodayCount = ref(0);

const barData = ref(null);
const barOptions = ref(null);
const lineData = ref(null);
const lineOptions = ref(null);
const pieData = ref(null);
const pieOptions = ref(null);
const pieCourseData = ref(null);
const pieCourseOptions = ref(null);
const router = useRouter(); // 使用 Vue Router

onMounted(async () => {
    try {
        const data = await DashboardService.getData();
        dashboardDatas.value = data;
        if (dashboardDatas.value) {
            popularCourse.value = dashboardDatas.value.popularCourse;
            proportion.value = dashboardDatas.value.proportion;
            memberTodayCount.value = dashboardDatas.value.memberTodayCount;
        }
        setColorOptions();
    } catch (error) {
        console.error('加載數據失敗', error);
    }
});

// 登出方法
const logout = () => {
    localStorage.removeItem('token'); // 清除 token
    router.push('/auth/login'); // 跳轉到登入頁面
};

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    lineData.value = {
        labels: ['7月', '8月', '9月', '10月', '11月', '12月'],
        datasets: [
            {
                label: dashboardDatas.value.firstCourseName,
                data: dashboardDatas.value.firstCourseData,
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                tension: 0.4
            },
            {
                label: dashboardDatas.value.secondCourseName,
                data: dashboardDatas.value.secondCourseData,
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                tension: 0.4
            }
        ]
    };
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    barData.value = {
        labels: ['7月', '8月', '9月', '10月', '11月', '12月'],
        datasets: [
            {
                label: '總銷售堂數(累計)',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                data: dashboardDatas.value.orderQuantityData
            },
            {
                label: '實際預約堂數(累計)',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                data: dashboardDatas.value.bookingQuantiyData
            }
        ]
    };
    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    pieData.value = {
        labels: ['英文', '日文', '中文', 'HTML/CSS', 'JavaScript', 'C#', 'SQL', '數學', '物理', '化學'],
        datasets: [
            {
                data: [30, 28, 26, 24, 22, 20, 8, 6, 4, 2],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-red-50'),
                    documentStyle.getPropertyValue('--p-red-100'),
                    documentStyle.getPropertyValue('--p-red-200'),
                    documentStyle.getPropertyValue('--p-red-300'),
                    documentStyle.getPropertyValue('--p-red-400'),
                    documentStyle.getPropertyValue('--p-red-500'),
                    documentStyle.getPropertyValue('--p-red-600'),
                    documentStyle.getPropertyValue('--p-red-700'),
                    documentStyle.getPropertyValue('--p-red-800'),
                    documentStyle.getPropertyValue('--p-red-900')
                ],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    pieCourseData.value = {
        labels: ['比爾叔的C#實戰班📣', '曹老師的SQL 超進階神級資料庫教學', '🐟金魚都能懂的HTML/CSS教學'],
        datasets: [
            {
                data: [333, 222, 200],
                backgroundColor: [documentStyle.getPropertyValue('--p-red-200'), documentStyle.getPropertyValue('--p-red-400'), documentStyle.getPropertyValue('--p-red-600')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
            }
        ]
    };

    pieCourseOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
}

watch(
    [getPrimary, getSurface, isDarkTheme],
    dashboardDatas,
    (newData) => {
        if (newData) {
            setColorOptions();
        }
    },
    { immediate: true }
);
</script>

<template>
    <!-- 概況小方塊 -->
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-12 xl:col-span-4">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">本日熱銷</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <span class="text-primary font-medium"> {{ popularCourse || '本日無訂單' }} </span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-4">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">本日業績較昨日</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <span class="text-primary font-medium"> {{ proportion }} %</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-4">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">會員今日新增</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <span class="text-primary font-medium"> {{ memberTodayCount }} 名</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div style="margin: 50px 0px"></div>
    <!-- 下方是四個chart圖表及穿插圖表 -->
    <Fluid class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">熱門課程業績差異曲線</div>
                <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">銷售數量及實際預約對照表</div>
                <Chart type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>
        <!-- <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">熱門科目占比</div>
                <Chart type="doughnut" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">熱門課程佔比</div>
                <Chart type="doughnut" :data="pieCourseData" :options="pieCourseOptions"></Chart>
            </div>
        </div> -->
    </Fluid>
</template>
