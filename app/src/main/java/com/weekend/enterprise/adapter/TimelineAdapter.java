package com.weekend.enterprise.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.weekend.enterprise.R;
import com.weekend.enterprise.model.TimelineEvent;

import java.util.List;

public class TimelineAdapter extends RecyclerView.Adapter<TimelineAdapter.TimelineViewHolder> {

    private final List<TimelineEvent> events;

    public TimelineAdapter(List<TimelineEvent> events) {
        this.events = events;
    }

    @NonNull
    @Override
    public TimelineViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_timeline, parent, false);
        return new TimelineViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TimelineViewHolder holder, int position) {
        TimelineEvent event = events.get(position);
        holder.tvYear.setText(event.getYear());
        holder.tvTitle.setText(event.getTitle());
        holder.tvDesc.setText(event.getDescription());

        if (position == 0) {
            holder.dot.setBackgroundResource(R.drawable.timeline_dot_first);
        } else {
            holder.dot.setBackgroundResource(R.drawable.timeline_dot);
        }
    }

    @Override
    public int getItemCount() {
        return events == null ? 0 : events.size();
    }

    static class TimelineViewHolder extends RecyclerView.ViewHolder {
        View dot;
        TextView tvYear;
        TextView tvTitle;
        TextView tvDesc;

        TimelineViewHolder(@NonNull View itemView) {
            super(itemView);
            dot = itemView.findViewById(R.id.view_timeline_dot);
            tvYear = itemView.findViewById(R.id.tv_timeline_year);
            tvTitle = itemView.findViewById(R.id.tv_timeline_title);
            tvDesc = itemView.findViewById(R.id.tv_timeline_desc);
        }
    }
}
