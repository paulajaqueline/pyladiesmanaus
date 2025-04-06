document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');

    const events = await EventViewer.loadEvents();
    const transformed = events.map(event => {
      const date = event.date.toDate ? event.date.toDate() : new Date(event.date);
      return {
        id: event.id,
        title: event.title,
        start: date,
        extendedProps: {
          description: event.description,
          even3Link: event.even3Link || '',
        }
      };
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'pt-br',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: transformed,
      eventClick: function (info) {
        const event = info.event;
        EventViewer.openModal({
          id: event.id,
          title: event.title,
          description: event.extendedProps.description,
          even3Link: event.extendedProps.even3Link,
          date: event.start
        });
      },
      height: 'auto'
    });

    calendar.render();
  });
