let tasks = [];
let schedule = [];
const currentDate = new Date().toISOString().split('T')[0];

// ÊÍãíá ÇáÈíÇäÇÊ ãä LocalStorage
function loadData() {
    const storedDate = localStorage.getItem('scheduleDate');
    if (storedDate !== currentDate) {
        localStorage.clear(); // ÍĞİ ÇáÈíÇäÇÊ ÅĞÇ ÊÛíÑ ÇáÊÇÑíÎ
    }
    const storedTasks = localStorage.getItem('tasks');
    const storedSchedule = localStorage.getItem('schedule');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
    schedule = storedSchedule ? JSON.parse(storedSchedule) : [];
    updateSchedule();
}

// ÍİÙ ÇáÈíÇäÇÊ İí LocalStorage
function saveData() {
    localStorage.setItem('scheduleDate', currentDate);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('schedule', JSON.stringify(schedule));
}

// ÅÖÇİÉ ãåãÉ
function addTask(event) {
    event.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const taskType = document.getElementById('task-type').value;
    const taskDuration = parseInt(document.getElementById('task-duration').value);
    const energyLevel = document.getElementById('energy-level').value;

    const task = {
        name: taskName,
        type: taskType,
        duration: taskDuration,
        energyLevel
    };

    tasks.push(task);
    saveData();
    document.getElementById('task-form').reset();
    alert(`Êã ÅÖÇİÉ ÇáãåãÉ: ${taskName}`);
}

// ÅäÔÇÁ ÇáÌÏæá Çáíæãí
function generateSchedule() {
    schedule = [];
    let totalAvailableMinutes;
    const energyLevel = tasks.length > 0 ? tasks[0].energyLevel : 'medium';

    switch (energyLevel) {
        case 'high':
            totalAvailableMinutes = 600; // 10 ÓÇÚÇÊ
            break;
        case 'medium':
            totalAvailableMinutes = 480; // 8 ÓÇÚÇÊ
            break;
        case 'low':
            totalAvailableMinutes = 360; // 6 ÓÇÚÇÊ
            break;
    }

    let currentTime = 8 * 60; // ÈÏÇíÉ ãä 8 ÕÈÇÍğÇ
    let usedTime = 0;

    tasks.forEach(task => {
        if (usedTime + task.duration <= totalAvailableMinutes) {
            const startHour = Math.floor(currentTime / 60);
            const startMinute = currentTime % 60;
            const endTime = currentTime + task.duration;
            const endHour = Math.floor(endTime / 60);
            const endMinute = endTime % 60;

            schedule.push({
                name: task.name,
                type: task.type,
                start: `${formatTime(startHour, startMinute)}`,
                end: `${formatTime(endHour, endMinute)}`,
                completed: false
            });

            currentTime += task.duration;
            usedTime += task.duration;

            if (task.type !== 'rest' && usedTime < totalAvailableMinutes) {
                const breakStartHour = Math.floor(currentTime / 60);
                const breakStartMinute = currentTime % 60;
                const breakEndTime = currentTime + 10;
                const breakEndHour = Math.floor(breakEndTime / 60);
                const breakEndMinute = breakEndTime % 60;

                schedule.push({
                    name: 'ÇÓÊÑÇÍÉ',
                    type: 'rest',
                    start: `${formatTime(breakStartHour, breakStartMinute)}`,
                    end: `${formatTime(breakEndHour, breakEndMinute)}`,
                    completed: false
                });

                currentTime += 10;
                usedTime += 10;
            }
        }
    });

    saveData();
    updateSchedule();
}

// ÊÍÏíË ÚÑÖ ÇáÌÏæá
function updateSchedule() {
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = '';

    if (schedule.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'áã íÊã ÅäÔÇÁ ÌÏæá ÈÚÏ.';
        scheduleList.appendChild(li);
        return;
    }

    schedule.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ãä ${item.start} Åáì ${item.end}`;
        li.classList.add(item.type);
        if (item.completed) li.classList.add('completed');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'ÅÊãÇã';
        completeBtn.onclick = () => toggleComplete(index);

        li.appendChild(completeBtn);
        scheduleList.appendChild(li);
    });
}

// ÔØÈ ÇáãåãÉ Ãæ ÅáÛÇÁ ÇáÔØÈ
function toggleComplete(index) {
    schedule[index].completed = !schedule[index].completed;
    saveData();
    updateSchedule();
}

// ÊÚÏíá ÇáãåÇã æÅäÔÇÁ ÌÏæá ÌÏíÏ
function resetAndEdit() {
    tasks = [];
    schedule = [];
    saveData();
    updateSchedule();
    alert('Êã ÍĞİ ÇáÌÏæá ÇáÓÇÈŞ¡ íãßäß ÇáÂä ÅÖÇİÉ ãåÇã ÌÏíÏÉ.');
}

// ÊäÓíŞ ÇáæŞÊ Åáì ÕíÛÉ HH:MM
function formatTime(hour, minute) {
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    return `${formattedHour}:${formattedMinute}`;
}

// ãÓÍ ÇáÈíÇäÇÊ İí äåÇíÉ Çáíæã
function clearDailyData() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const timeLeft = endOfDay - now;
    setTimeout(() => {
        localStorage.clear();
        tasks = [];
        schedule = [];
        updateSchedule();
    }, timeLeft);
}

// ÊÍãíá ÇáÈíÇäÇÊ æÊİÚíá ÇáãÓÍ Çáíæãí
loadData();
clearDailyData();