<template>
  <div class="avatar-selector">
    <h6 class="mb-3">Selecciona un avatar:</h6>
    <div class="avatar-grid">
      <div 
        v-for="(avatar, index) in avatars" 
        :key="index" 
        class="avatar-option"
        :class="{ 'selected': selectedIndex === index }"
        @click="selectAvatar(index)">
        <i :class="avatar.icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({ type: 'icon', value: 'bi-person-circle' })
    }
  },
  
  data() {
    return {
      selectedIndex: 0,
      avatars: [
        { type: 'icon', value: 'bi-person-circle', icon: 'bi bi-person-circle' },
        { type: 'icon', value: 'bi-person-bounding-box', icon: 'bi bi-person-bounding-box' },
        { type: 'icon', value: 'bi-person-badge', icon: 'bi bi-person-badge' },
        { type: 'icon', value: 'bi-person-workspace', icon: 'bi bi-person-workspace' },
        { type: 'icon', value: 'bi-briefcase-fill', icon: 'bi bi-briefcase-fill' },
        { type: 'icon', value: 'bi-tools', icon: 'bi bi-tools' },
        { type: 'icon', value: 'bi-lightning-charge-fill', icon: 'bi bi-lightning-charge-fill' },
        { type: 'icon', value: 'bi-speedometer', icon: 'bi bi-speedometer' },
        { type: 'icon', value: 'bi-gear-fill', icon: 'bi bi-gear-fill' },
        { type: 'icon', value: 'bi-cpu-fill', icon: 'bi bi-cpu-fill' },
        { type: 'icon', value: 'bi-laptop', icon: 'bi bi-laptop' },
        { type: 'icon', value: 'bi-wrench', icon: 'bi bi-wrench' }
      ]
    }
  },
  
  created() {
    this.initSelectedAvatar();
  },
  
  watch: {
    value: {
      handler: 'initSelectedAvatar',
      immediate: true
    }
  },
  
  methods: {
    initSelectedAvatar() {
      if (this.value) {
        const index = this.avatars.findIndex(a => a.value === this.value.value);
        if (index !== -1) {
          this.selectedIndex = index;
        }
      }
    },
    
    selectAvatar(index) {
      this.selectedIndex = index;
      this.$emit('input', {...this.avatars[index]});
    }
  }
}
</script>

<style scoped>
.avatar-selector {
  padding: 10px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.avatar-option {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.avatar-option:hover {
  background-color: #e9ecef;
  transform: scale(1.05);
}

.avatar-option.selected {
  border-color: #1e4d92;
  background-color: #e3f2fd;
}

.avatar-option i {
  font-size: 1.8rem;
  color: #1e4d92;
}

@media (max-width: 576px) {
  .avatar-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .avatar-option {
    width: 50px;
    height: 50px;
  }
  
  .avatar-option i {
    font-size: 1.5rem;
  }
}
</style> 