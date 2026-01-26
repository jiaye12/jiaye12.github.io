# 2025 X-AGI & 第18届中国R会议官方网站

## 网站概述

这是2025 X-AGI & 第18届中国R会议的官方网站，提供会议信息、日程安排、短期课程、参会指南和报名服务。

## 页面结构

- **首页 (index.html)** - 会议概览和主要信息
- **会议简介 (about.html)** - 会议背景、主办单位、赞助伙伴
- **日程安排 (schedule.html)** - 会议日程和分会场安排
- **短期课程 (courses.html)** - 会前培训课程信息
- **参会指南 (guide.html)** - 场地、住宿、交通等实用信息
- **报名参会 (register.html)** - 在线报名表单


## 修改方法

### schedule的修改方法：

1. 如何修改默认状态？

如果您想改变某个演讲者的默认状态，只需要：
+ 改为默认展开：
    + 将 aria-expanded="false" 改为 aria-expanded="true"
    + 在 class="collapse" 中添加 show，变成 class="collapse show"
+ 改为默认收起：
    + 将 aria-expanded="true" 改为 aria-expanded="false"
    + 从 class="collapse show" 中移除 show，变成 class="collapse"

2. 调整头像位置：
    ```html
    <img src="assets/speaker_photo/JunLiu.jpg" alt="刘军教授" 
        class="speaker-photo" 
        style="object-position: center 30%;"
        onerror="this.src='assets/images/default-speaker.jpg'">
    ```


3.  如何添加一个全新的场次
    复制粘贴，注意更改`id="session-19-am"`，保证可以正常跳转
4.  如何在一个已有场次中添加一位新的演讲者
    复制粘贴，注意这三个地方的speaker7需要替换，这个编号必须全局唯一
    ```html
        <div class="session-speaker" data-bs-toggle="collapse" data-bs-target="#speaker7" aria-expanded="false" aria-controls="speaker7">
        <span>赵健博 | 字节跳动资深技术专家</span><i class="fas fa-chevron-down expand-icon"></i>
    </div>
    <div class="collapse" id="speaker7">
    ```
