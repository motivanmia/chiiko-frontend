// stores/notification.js
import { defineStore } from 'pinia';
const apiBase = import.meta.env.VITE_API_BASE;

function toContentObj(val) {
  if (val && typeof val === 'object') {
    return { title: String(val.title ?? ''), content: String(val.content ?? '') };
  }
  if (typeof val === 'string') {
    try {
      const o = JSON.parse(val);
      return { title: String(o?.title ?? ''), content: String(o?.content ?? '') };
    } catch {
      return { title: '', content: val };
    }
  }
  return { title: '', content: '' };
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),

  getters: {
    unreadCount: (s) => s.list.filter((n) => String(n.status) === '0').length,
    unreadList: (s) => s.list.filter((n) => String(n.status) === '0'),
    readList: (s) => s.list.filter((n) => String(n.status) === '1'),
  },

  actions: {
    async loadNotifications() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${apiBase}/member/get_notification.php`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();

        if (body.status === 'success' && Array.isArray(body.data)) {
          this.list = body.data.map((n) => {
            const parsed = toContentObj(n.content);
            const createdRaw = n.created_at ?? '';
            const createdDate = String(createdRaw).slice(0, 10);
            return {
              ...n,
              notification_id: Number(n.notification_id),
              receiver_id: Number(n.receiver_id),
              comment_id: n.comment_id === null ? null : Number(n.comment_id),
              recipe_id: n.recipe_id === null ? null : Number(n.recipe_id),
              order_id: n.order_id === null ? null : Number(n.order_id),
              type: Number(n.type),
              status: String(n.status),
              created_at: createdRaw,
              created_date: createdDate,
              content_raw: n.content,
              content_obj: parsed,
              content_title: parsed.title,
              content_text: parsed.content,
            };
          });
        } else {
          this.error = body.message || '取得通知失敗';
          this.list = [];
        }
      } catch (e) {
        this.error = e.message || '連線錯誤';
        this.list = [];
      } finally {
        this.loading = false;
      }
    },

    async markRead(id) {
      try {
        const res = await fetch(`${apiBase}/member/patch_notification.php`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (body.status !== 'success') throw new Error(body.message || '標記失敗');

        this.list = this.list.map((n) => (n.notification_id === id ? { ...n, status: '1' } : n));
      } catch (e) {
        this.error = e.message || '連線錯誤';
      }
    },

    async markAllReadRemote() {
      const ids = this.unreadList.map((n) => n.notification_id);
      if (ids.length === 0) return;
      try {
        const res = await fetch(`${apiBase}/member/patch_notification.php`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ ids }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (body.status !== 'success') throw new Error(body.message || '標記失敗');

        this.list = this.list.map((n) =>
          ids.includes(n.notification_id) ? { ...n, status: '1' } : n,
        );
      } catch (e) {
        this.error = e.message || '連線錯誤';
      }
    },
  },
});
